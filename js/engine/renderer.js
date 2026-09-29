import { getRecommendedResolution, getPlatformProfile } from './platform.js';

const VS = `
attribute vec3 aPosition;
attribute vec3 aNormal;
uniform mat4 uProjection;
uniform mat4 uView;
uniform mat4 uModel;
varying vec3 vNormal;
varying vec3 vWorld;
void main(){
  vec4 world=uModel*vec4(aPosition,1.0);
  vWorld=world.xyz;
  vNormal=mat3(uModel)*aNormal;
  gl_Position=uProjection*uView*world;
}`;

const FS = `
precision mediump float;
uniform vec3 uColour;
uniform vec3 uCamera;
uniform float uPower;
uniform float uFog;
varying vec3 vNormal;
varying vec3 vWorld;
void main(){
  vec3 n=normalize(vNormal);
  vec3 l=normalize(vec3(-0.35,0.85,0.45));
  float diffuse=max(dot(n,l),0.0);
  float rim=pow(1.0-max(dot(n,normalize(uCamera-vWorld)),0.0),2.0);
  float pulse=0.88+0.12*sin(vWorld.x*0.55+vWorld.z*0.31);
  vec3 lit=uColour*(0.16+diffuse*0.58+rim*0.12)*mix(0.52,1.0,uPower)*pulse;
  float distanceFog=clamp(length(uCamera-vWorld)*uFog,0.0,0.82);
  vec3 fog=vec3(0.018,0.022,0.026);
  gl_FragColor=vec4(mix(lit,fog,distanceFog),1.0);
}`;

export class NightmareRenderer {
  constructor(canvas){
    this.canvas=canvas;
    this.gl=canvas?.getContext('webgl',{antialias:true,alpha:false,depth:true})||null;
    this.ready=Boolean(this.gl);
    this.profile=getPlatformProfile();
    this.program=null;
    this.buffers=null;
    this.layout=null;
    this.camera={x:0,y:1.72,z:0,yaw:0,pitch:0};
    this.velocityY=0;
    this.keys=new Set();
    this.lastTime=performance.now();
    this.power=0.68;
    this.currentRoom='hub';
    this.colliders=[];
    this.floorY=0;
    this.fog=0.018;
    if(this.ready) this.#init();
  }

  #init(){
    const gl=this.gl;
    gl.enable(gl.DEPTH_TEST);
    gl.enable(gl.CULL_FACE);
    gl.clearColor(0.006,0.008,0.01,1);
    const vs=this.#compile(gl.VERTEX_SHADER,VS);
    const fs=this.#compile(gl.FRAGMENT_SHADER,FS);
    this.program=gl.createProgram();
    gl.attachShader(this.program,vs); gl.attachShader(this.program,fs);
    gl.linkProgram(this.program);
    if(!gl.getProgramParameter(this.program,gl.LINK_STATUS)) throw new Error(gl.getProgramInfoLog(this.program));
    gl.useProgram(this.program);
    this.locations={
      position:gl.getAttribLocation(this.program,'aPosition'),
      normal:gl.getAttribLocation(this.program,'aNormal'),
      projection:gl.getUniformLocation(this.program,'uProjection'),
      view:gl.getUniformLocation(this.program,'uView'),
      model:gl.getUniformLocation(this.program,'uModel'),
      colour:gl.getUniformLocation(this.program,'uColour'),
      camera:gl.getUniformLocation(this.program,'uCamera'),
      power:gl.getUniformLocation(this.program,'uPower'),
      fog:gl.getUniformLocation(this.program,'uFog')
    };
    this.buffers={position:gl.createBuffer(),normal:gl.createBuffer(),index:gl.createBuffer()};
  }

  #compile(type,source){
    const gl=this.gl, shader=gl.createShader(type);
    gl.shaderSource(shader,source); gl.compileShader(shader);
    if(!gl.getShaderParameter(shader,gl.COMPILE_STATUS)) throw new Error(gl.getShaderInfoLog(shader));
    return shader;
  }

  resize(){
    if(!this.canvas||!this.gl) return;
    const {width,height}=getRecommendedResolution(this.canvas);
    if(this.canvas.width!==width||this.canvas.height!==height){
      this.canvas.width=width; this.canvas.height=height;
    }
    this.gl.viewport(0,0,width,height);
  }

  setLayout(layout){
    this.layout=layout;
    this.colliders=[];
    if(!layout?.nodes?.length) return;
    const hub=layout.nodes.find(n=>n.type==='hub')||layout.nodes[0];
    this.camera.x=hub.x; this.camera.z=hub.z+3.2;
    this.camera.y=1.72;
    this.camera.yaw=Math.PI;
    this.currentRoom=hub.id;
    this.#buildColliders(layout);
  }

  setPower(value){ this.power=Math.max(0,Math.min(1,Number(value)||0)); }

  setInput(keys){ this.keys=keys; }

  update(dt){
    if(!this.ready||!this.layout) return;
    const speed=this.keys.has('ShiftLeft')||this.keys.has('ShiftRight')?5.4:3.1;
    let forward=(this.keys.has('KeyW')?1:0)-(this.keys.has('KeyS')?1:0);
    let strafe=(this.keys.has('KeyD')?1:0)-(this.keys.has('KeyA')?1:0);
    const mag=Math.hypot(forward,strafe)||1;
    forward/=mag; strafe/=mag;
    const sin=Math.sin(this.camera.yaw), cos=Math.cos(this.camera.yaw);
    const dx=(sin*forward+cos*strafe)*speed*dt;
    const dz=(cos*forward-sin*strafe)*speed*dt;
    const nextX=this.camera.x+dx, nextZ=this.camera.z+dz;
    if(!this.#blocked(nextX,this.camera.z)) this.camera.x=nextX;
    if(!this.#blocked(this.camera.x,nextZ)) this.camera.z=nextZ;
    this.camera.y=1.72;
    this.currentRoom=this.#roomAt(this.camera.x,this.camera.z)||this.currentRoom;
  }

  render(){
    if(!this.ready) return;
    const gl=this.gl;
    gl.clear(gl.COLOR_BUFFER_BIT|gl.DEPTH_BUFFER_BIT);
    if(!this.layout) return;
    const aspect=this.canvas.width/Math.max(1,this.canvas.height);
    const projection=perspective(Math.PI/3,aspect,0.08,180);
    const view=look(this.camera);
    gl.useProgram(this.program);
    gl.uniformMatrix4fv(this.locations.projection,false,projection);
    gl.uniformMatrix4fv(this.locations.view,false,view);
    gl.uniform3f(this.locations.camera,this.camera.x,this.camera.y,this.camera.z);
    gl.uniform1f(this.locations.power,this.power);
    gl.uniform1f(this.locations.fog,this.fog);
    this.#drawWorld();
  }

  frame(){
    const now=performance.now(),dt=Math.min(0.05,(now-this.lastTime)/1000);
    this.lastTime=now;
    this.update(dt);
    this.render();
    requestAnimationFrame(()=>this.frame());
  }

  start(){
    this.resize();
    this.lastTime=performance.now();
    requestAnimationFrame(()=>this.frame());
  }

  clear(){
    if(!this.gl) return;
    this.gl.clearColor(0.006,0.008,0.01,1);
    this.gl.clear(this.gl.COLOR_BUFFER_BIT|this.gl.DEPTH_BUFFER_BIT);
  }

  getCamera(){ return {...this.camera}; }
  getRoom(){ return this.currentRoom; }

  #drawWorld(){
    const nodeMap=new Map(this.layout.nodes.map(n=>[n.id,n]));
    const linked=new Map(this.layout.nodes.map(n=>[n.id,[]]));
    for(const e of this.layout.edges){
      if(linked.has(e.from)) linked.get(e.from).push(e.to);
      if(linked.has(e.to)) linked.get(e.to).push(e.from);
    }
    for(const node of this.layout.nodes){
      const size=node.type==='hub'?12:node.type==='gallery'?10:node.type==='destination'?11:8;
      const depth=node.type==='hub'?9:node.type==='hall'?5.5:7;
      this.#box(node.x,0,node.z,size,0.18,depth,[0.075,0.085,0.09]);
      this.#box(node.x,4.2,node.z,size,0.16,depth,[0.035,0.04,0.045]);
      const neighbours=linked.get(node.id)||[];
      this.#roomWalls(node,size,depth,neighbours,nodeMap);
      this.#doorMarker(node);
    }
    for(const edge of this.layout.edges){
      const a=nodeMap.get(edge.from),b=nodeMap.get(edge.to);
      if(!a||!b) continue;
      this.#corridor(a,b);
    }
    for(const stair of this.layout.stairs||[]){
      const n=nodeMap.get(stair.room);
      if(n) this.#stairs(n,stair.direction);
    }
  }

  #box(x,y,z,w,h,d,c){ this.#mesh(cuboid(w,h,d),translate(x,y,z),c); }
  #wall(x,y,z,w,h,d,c){ this.#mesh(cuboid(w,h,d),translate(x,y,z),c); }

  #roomWalls(node,w,d,neighbours,nodeMap){
    const has=(dx,dz)=>neighbours.some(id=>{
      const n=nodeMap.get(id); return n&&Math.sign(n.x-node.x)===dx&&Math.sign(n.z-node.z)===dz;
    });
    const wall=[0.11,0.105,0.10], back=[0.085,0.09,0.095];
    this.#wall(node.x-w/2,2.1,node.z,0.18,4.2,d,wall);
    this.#wall(node.x+w/2,2.1,node.z,0.18,4.2,d,wall);
    this.#openingWall(node.x,2.1,node.z-d/2,w,4.2,0.18,has(0,-1),back);
    this.#openingWall(node.x,2.1,node.z+d/2,w,4.2,0.18,has(0,1),back);
  }

  #openingWall(x,y,z,w,h,t,opening,c){
    if(!opening){ this.#wall(x,y,z,w,h,t,c); return; }
    const gap=2.5, segment=(w-gap)/2;
    if(segment>0){
      this.#wall(x-(gap+segment)/2,y,z,segment,h,t,c);
      this.#wall(x+(gap+segment)/2,y,z,segment,h,t,c);
    }
    this.#wall(x,y+h/2-0.18,z,gap,0.36,t,c);
  }

  #corridor(a,b){
    const dx=b.x-a.x,dz=b.z-a.z,len=Math.hypot(dx,dz);
    const angle=Math.atan2(dx,dz),mx=(a.x+b.x)/2,mz=(a.z+b.z)/2;
    const width=3.2,height=3.7,sideOffset=width/2;
    const base=multiply(translate(mx,0,mz),rotateY(angle));
    this.#mesh(cuboid(width,0.18,len),multiply(base,translate(0,0.09,0)),[0.065,0.07,0.075]);
    this.#mesh(cuboid(width,0.16,len),multiply(base,translate(0,height,0)),[0.035,0.04,0.045]);
    this.#mesh(cuboid(0.16,height,len),multiply(base,translate(-sideOffset,height/2,0)),[0.10,0.095,0.09]);
    this.#mesh(cuboid(0.16,height,len),multiply(base,translate(sideOffset,height/2,0)),[0.10,0.095,0.09]);
  }

  #doorMarker(n){
    const w=n.type==='hub'?3.2:2.2;
    this.#box(n.x,1.65,n.z+3.48,w,3.3,0.08,[0.018,0.028,0.032]);
  }

  #stairs(n,direction){
    const steps=6,dir=direction==='up'?1:-1;
    for(let i=0;i<steps;i++){
      const y=(i+1)*0.32*dir;
      this.#box(n.x-2+i*0.5,Math.abs(y)/2,n.z,0.65,Math.abs(y)+0.08,2.2,[0.09,0.08,0.075]);
    }
  }

  #buildColliders(layout){
    for(const n of layout.nodes){
      const size=n.type==='hub'?12:n.type==='gallery'?10:n.type==='destination'?11:8;
      const depth=n.type==='hub'?9:n.type==='hall'?5.5:7;
      this.colliders.push({x:n.x,z:n.z,w:size-0.45,d:depth-0.45,room:n.id});
    }
    const nodeMap=new Map(layout.nodes.map(n=>[n.id,n]));
    for(const e of layout.edges){
      const a=nodeMap.get(e.from),b=nodeMap.get(e.to); if(!a||!b) continue;
      const dx=b.x-a.x,dz=b.z-a.z,len=Math.hypot(dx,dz);
      this.colliders.push({x:(a.x+b.x)/2,z:(a.z+b.z)/2,w:Math.max(3,len-0.6),d:Math.max(3,len-0.6),room:a.id,corridor:true});
    }
  }

  #blocked(x,z){
    for(const r of this.colliders){
      if(x>r.x-r.w/2&&x<r.x+r.w/2&&z>r.z-r.d/2&&z<r.z+r.d/2) return false;
    }
    return true;
  }

  #roomAt(x,z){
    for(const r of this.colliders){
      if(x>r.x-r.w/2&&x<r.x+r.w/2&&z>r.z-r.d/2&&z<r.z+r.d/2) return r.room;
    }
    return null;
  }

  #mesh(data,model,colour){
    const gl=this.gl;
    const c=colour||[0.08,0.08,0.09];
    gl.bindBuffer(gl.ARRAY_BUFFER,this.buffers.position);
    gl.bufferData(gl.ARRAY_BUFFER,new Float32Array(data.positions),gl.STREAM_DRAW);
    gl.enableVertexAttribArray(this.locations.position);
    gl.vertexAttribPointer(this.locations.position,3,gl.FLOAT,false,0,0);
    gl.bindBuffer(gl.ARRAY_BUFFER,this.buffers.normal);
    gl.bufferData(gl.ARRAY_BUFFER,new Float32Array(data.normals),gl.STREAM_DRAW);
    gl.enableVertexAttribArray(this.locations.normal);
    gl.vertexAttribPointer(this.locations.normal,3,gl.FLOAT,false,0,0);
    gl.bindBuffer(gl.ELEMENT_ARRAY_BUFFER,this.buffers.index);
    gl.bufferData(gl.ELEMENT_ARRAY_BUFFER,new Uint16Array(data.indices),gl.STREAM_DRAW);
    gl.uniformMatrix4fv(this.locations.model,false,model);
    gl.uniform3fv(this.locations.colour,new Float32Array(c));
    gl.drawElements(gl.TRIANGLES,data.indices.length,gl.UNSIGNED_SHORT,0);
  }
}

function cuboid(w,h,d){
  const x=w/2,y=h/2,z=d/2;
  const p=[-x,-y,-z,x,-y,-z,x,y,-z,-x,y,-z,-x,-y,z,x,-y,z,x,y,z,-x,y,z];
  const n=[0,0,-1,0,0,-1,0,0,-1,0,0,-1,0,0,1,0,0,1,0,0,1,0,0,1,-1,0,0,-1,0,0,-1,0,0,1,0,0,1,0,0,1,0,0];
  const i=[0,1,2,0,2,3,4,6,5,4,7,6,0,4,5,0,5,1,3,2,6,3,6,7,1,5,6,1,6,2,0,3,7,0,7,4];
  const normals=[];
  for(let f=0;f<6;f++) for(let k=0;k<4;k++) normals.push(n[f*3],n[f*3+1],n[f*3+2]);
  return {positions:p,normals,indices:i};
}
function translate(x,y,z){ return [1,0,0,0,0,1,0,0,0,0,1,0,x,y,z,1]; }
function rotateY(a){ const c=Math.cos(a),s=Math.sin(a); return [c,0,-s,0,0,1,0,0,s,0,c,0,0,0,0,1]; }
function multiply(a,b){ const o=new Array(16); for(let r=0;r<4;r++)for(let c=0;c<4;c++)o[c+r*4]=a[r*4]*b[c]+a[r*4+1]*b[c+4]+a[r*4+2]*b[c+8]+a[r*4+3]*b[c+12]; return o; }
function perspective(fovy,aspect,near,far){ const f=1/Math.tan(fovy/2),nf=1/(near-far); return [f/aspect,0,0,0,0,f,0,0,0,0,(far+near)*nf,-1,0,0,(2*far*near)*nf,0]; }
function look(c){
  const cp=Math.cos(c.pitch),sp=Math.sin(c.pitch),cy=Math.cos(c.yaw),sy=Math.sin(c.yaw);
  const fx=sy*cp,fy=sp,fz=cy*cp;
  const rx=Math.cos(c.yaw),rz=-Math.sin(c.yaw);
  const ux=rz*fy,uy=rx*fy-0,uz=-rx*fy;
  const z=[-fx,-fy,-fz],x=[rx,0,rz],y=[ux,uy,uz];
  return [x[0],y[0],z[0],0,x[1],y[1],z[1],0,x[2],y[2],z[2],0,-(x[0]*c.x+x[1]*c.y+x[2]*c.z),-(y[0]*c.x+y[1]*c.y+y[2]*c.z),-(z[0]*c.x+z[1]*c.y+z[2]*c.z),1];
}
