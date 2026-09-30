import * as THREE from 'https://cdn.jsdelivr.net/npm/three@0.186.0/build/three.module.js';
import { GLTFLoader } from 'https://cdn.jsdelivr.net/npm/three@0.186.0/examples/jsm/loaders/GLTFLoader.js';
import { getPlatformProfile,getRecommendedResolution } from './platform.js';
const S=9,H=4.4,PH=1.72;

export class NightmareThreeRenderer{
constructor(canvas){
 this.canvas=canvas;this.profile=getPlatformProfile();this.scene=new THREE.Scene();
 this.scene.background=new THREE.Color(0x020304);this.scene.fog=new THREE.FogExp2(0x020304,this.profile.android?.018:.009);
 this.camera=new THREE.PerspectiveCamera(67,1,.05,260);this.camera.rotation.order='YXZ';
 this.renderer=new THREE.WebGLRenderer({canvas,antialias:!this.profile.android,powerPreference:'high-performance'});
 this.renderer.outputColorSpace=THREE.SRGBColorSpace;this.renderer.toneMapping=THREE.ACESFilmicToneMapping;this.renderer.toneMappingExposure=1.05;
 this.renderer.shadowMap.enabled=!this.profile.android;this.renderer.shadowMap.type=this.profile.android?THREE.BasicShadowMap:THREE.PCFSoftShadowMap;
 this.world=new THREE.Group();this.scene.add(this.world);this.camera.position.set(0,PH,4);this.keys=new Set();this.colliders=[];
 this.currentRoom='hub';this.playerRadius=.28;this.power=.68;this.yaw=0;this.pitch=0;this.last=performance.now();this.running=false;this.effects=new Set();
 this.loader=new GLTFLoader();
 this.m={floor:new THREE.MeshStandardMaterial({color:0x252827,roughness:.92}),wall:new THREE.MeshStandardMaterial({color:0x343533,roughness:.86}),dark:new THREE.MeshStandardMaterial({color:0x171a19,roughness:.9}),ceiling:new THREE.MeshStandardMaterial({color:0x111413,roughness:1}),trim:new THREE.MeshStandardMaterial({color:0x51483f,roughness:.72})};
 this.hemi=new THREE.HemisphereLight(0x89929a,0x090a0a,.62);this.scene.add(this.hemi);
 this.key=new THREE.DirectionalLight(0xb9c5ce,1.55);this.key.position.set(12,18,8);this.key.castShadow=!this.profile.android;
 if(this.key.shadow)this.key.shadow.mapSize.set(this.profile.android?512:1024,this.profile.android?512:1024);this.scene.add(this.key);
 this.#input();this.resize();
}
#input(){
 window.addEventListener('keydown',e=>this.keys.add(e.code));window.addEventListener('keyup',e=>this.keys.delete(e.code));
 this.canvas.addEventListener('click',()=>this.canvas.requestPointerLock?.());
 this.canvas.addEventListener('mousemove',e=>{if(document.pointerLockElement!==this.canvas)return;this.yaw-=e.movementX*.0024;this.pitch=THREE.MathUtils.clamp(this.pitch-e.movementY*.0024,-1.35,1.35)});
}
resize(){
 const rect=this.canvas.getBoundingClientRect(),cssW=Math.max(1,Math.floor(rect.width||this.canvas.clientWidth||800)),cssH=Math.max(1,Math.floor(rect.height||this.canvas.clientHeight||600));
 const r=getRecommendedResolution(this.canvas);this.canvas.width=Math.max(1,r.width||Math.floor(cssW*(window.devicePixelRatio||1)));this.canvas.height=Math.max(1,r.height||Math.floor(cssH*(window.devicePixelRatio||1)));
 this.camera.aspect=cssW/cssH;this.camera.updateProjectionMatrix();this.renderer.setPixelRatio(1);this.renderer.setSize(this.canvas.width,this.canvas.height,false);
}
point(n){return new THREE.Vector3(n.x*S,0,n.z*S)}
dims(n){
 const sizes={hub:[13,11],'grand-hall':[13,11],gallery:[11,9],'dining-hall':[12,10],library:[11,9],study:[9,9],conservatory:[12,10],bedroom:[9,9],service:[9,8],storage:[8,8],security:[10,9],chapel:[12,11],'machine-room':[12,10]};
 const [w,d]=sizes[n.archetype]||sizes[n.type]||[9,9];return {w,d};
}
box(g,size,pos,mat,cast=true){const m=new THREE.Mesh(new THREE.BoxGeometry(size.x,size.y,size.z),mat);m.position.copy(pos);m.castShadow=cast&&!this.profile.android;m.receiveShadow=true;g.add(m);return m}
setLayout(layout){
 this.layout=layout;this.world.clear();this.colliders=[];
 const map=new Map(layout.nodes.map(n=>[n.id,n])),links=new Map(layout.nodes.map(n=>[n.id,[]]));
 for(const e of layout.edges){links.get(e.from)?.push(e.to);links.get(e.to)?.push(e.from)}
 for(const n of layout.nodes){const p=this.point(n),d=this.dims(n);this.room(n,p,d,links.get(n.id)||[],map);this.colliders.push({x:p.x,z:p.z,w:d.w-.55,d:d.d-.55,room:n.id})}
 for(const e of layout.edges){const a=map.get(e.from),b=map.get(e.to);if(a&&b){this.corridor(a,b);const pa=this.point(a),pb=this.point(b),dx=Math.abs(pb.x-pa.x),dz=Math.abs(pb.z-pa.z);this.colliders.push({x:(pa.x+pb.x)/2,z:(pa.z+pb.z)/2,w:dx>dz?Math.max(2.4,dx-1.0):2.4,d:dz>dx?Math.max(2.4,dz-1.0):2.4,room:a.id,corridor:true})}}
 for(const s of layout.stairs||[]){const n=map.get(s.room);if(n)this.stairs(n)}
 const hub=layout.nodes.find(n=>n.type==='hub')||layout.nodes[0],p=this.point(hub);
this.camera.position.set(p.x,PH,p.z);
const firstExit=(layout.edges||[]).find(e=>e.from===hub.id||e.to===hub.id);
if(firstExit){
 const otherId=firstExit.from===hub.id?firstExit.to:firstExit.from;
 const other=map.get(otherId);
 if(other){const dx=other.x-hub.x,dz=other.z-hub.z;this.yaw=Math.atan2(dx,-dz);}
}
this.currentRoom=hub.id;this.camera.rotation.set(this.pitch,this.yaw,0);
}
wall(g,axis,edge,span,open){const mat=axis==='x'?this.m.wall:this.m.dark;if(!open){this.box(g,axis==='x'?new THREE.Vector3(.18,H,span):new THREE.Vector3(span,H,.18),axis==='x'?new THREE.Vector3(edge,H/2,0):new THREE.Vector3(0,H/2,edge),mat);return}const gap=2.4,seg=(span-gap)/2;if(axis==='x'){this.box(g,new THREE.Vector3(.18,H,seg),new THREE.Vector3(edge,H/2,-(gap+seg)/2),mat);this.box(g,new THREE.Vector3(.18,H,seg),new THREE.Vector3(edge,H/2,(gap+seg)/2),mat);this.box(g,new THREE.Vector3(.18,.55,gap),new THREE.Vector3(edge,H-.275,0),mat)}else{this.box(g,new THREE.Vector3(seg,H,.18),new THREE.Vector3(-(gap+seg)/2,H/2,edge),mat);this.box(g,new THREE.Vector3(seg,H,.18),new THREE.Vector3((gap+seg)/2,H/2,edge),mat);this.box(g,new THREE.Vector3(gap,.55,.18),new THREE.Vector3(0,H-.275,edge),mat)}}
room(n,p,d,ns,map){
 const g=new THREE.Group();g.position.copy(p);this.box(g,new THREE.Vector3(d.w,.24,d.d),new THREE.Vector3(0,-.12,0),this.m.floor,false);this.box(g,new THREE.Vector3(d.w,.18,d.d),new THREE.Vector3(0,H+.08,0),this.m.ceiling,false);
 const has=(dx,dz)=>ns.some(id=>{const q=map.get(id);return q&&Math.sign(q.x-n.x)===dx&&Math.sign(q.z-n.z)===dz});
 this.wall(g,'x',-d.w/2,d.d,has(-1,0));this.wall(g,'x',d.w/2,d.d,has(1,0));this.wall(g,'z',-d.d/2,d.w,has(0,-1));this.wall(g,'z',d.d/2,d.w,has(0,1));
 const l=new THREE.PointLight(0xffd7aa,n.type==='hub'?5:2.7,n.type==='hub'?18:13,2);l.position.y=3.55;l.castShadow=!this.profile.android;g.add(l);
 if(n.type==='destination'||n.type==='gallery'||n.archetype==='chapel'){const a=new THREE.PointLight(0xb31926,1.4,8,2);a.position.y=1.7;g.add(a)}
 this.world.add(g);
}
corridor(a,b){const pa=this.point(a),pb=this.point(b),mid=pa.clone().add(pb).multiplyScalar(.5),delta=pb.clone().sub(pa),len=delta.length(),g=new THREE.Group();g.position.set(mid.x,0,mid.z);g.rotation.y=Math.atan2(delta.x,delta.z);this.box(g,new THREE.Vector3(2.8,.2,len),new THREE.Vector3(0,-.1,0),this.m.floor,false);this.box(g,new THREE.Vector3(2.8,.16,len),new THREE.Vector3(0,H,0),this.m.ceiling,false);this.box(g,new THREE.Vector3(.16,H,len),new THREE.Vector3(-1.4,H/2,0),this.m.dark);this.box(g,new THREE.Vector3(.16,H,len),new THREE.Vector3(1.4,H/2,0),this.m.dark);const l=new THREE.PointLight(0x8fa6b8,1.1,9,2);l.position.y=3.4;g.add(l);this.world.add(g)}
stairs(n){const p=this.point(n),g=new THREE.Group();g.position.copy(p);for(let i=0;i<7;i++)this.box(g,new THREE.Vector3(3.1,.22+i*.18,.62),new THREE.Vector3(-2+i*.62,(i*.18)/2,0),this.m.trim);this.world.add(g)}
setPower(v){this.power=THREE.MathUtils.clamp(Number(v)||0,0,1);this.key.intensity=.35+this.power*.85;this.hemi.intensity=.12+this.power*.28}
blocked(x,z){
 const r=this.playerRadius;
 return !this.colliders.some(c=>x>c.x-c.w/2+r&&x<c.x+c.w/2-r&&z>c.z-c.d/2+r&&z<c.z+c.d/2-r);
}
roomAt(x,z){return this.colliders.find(r=>x>r.x-r.w/2&&x<r.x+r.w/2&&z>r.z-r.d/2&&z<r.z+r.d/2)?.room||this.currentRoom}
update(dt){if(!this.layout)return;const speed=this.keys.has('ShiftLeft')||this.keys.has('ShiftRight')?5.8:3.4;let f=(this.keys.has('KeyW')?1:0)-(this.keys.has('KeyS')?1:0),s=(this.keys.has('KeyD')?1:0)-(this.keys.has('KeyA')?1:0),mag=Math.hypot(f,s)||1;f/=mag;s/=mag;const dx=(Math.sin(this.yaw)*f+Math.cos(this.yaw)*s)*speed*dt,dz=(-Math.cos(this.yaw)*f+Math.sin(this.yaw)*s)*speed*dt,nx=this.camera.position.x+dx,nz=this.camera.position.z+dz;if(!this.blocked(nx,this.camera.position.z))this.camera.position.x=nx;
if(!this.blocked(this.camera.position.x,nz))this.camera.position.z=nz;this.camera.position.y=PH;this.camera.rotation.set(this.pitch,this.yaw,0);this.currentRoom=this.roomAt(this.camera.position.x,this.camera.position.z)}
addEffect(effect){if(effect?.update)this.effects.add(effect);return effect}removeEffect(effect){this.effects.delete(effect)}render(){this.renderer.render(this.scene,this.camera)}
frame=()=>{if(!this.running)return;const now=performance.now(),dt=Math.min(.05,(now-this.last)/1000);this.last=now;this.update(dt);for(const effect of this.effects)effect.update?.(dt);this.render();requestAnimationFrame(this.frame)}
start(){if(this.running)return;this.running=true;this.last=performance.now();this.frame()}
getRoom(){return this.currentRoom}
async loadGLTF(url,options={}){const gltf=await this.loader.loadAsync(url),root=gltf.scene;root.traverse(o=>{if(o.isMesh){o.castShadow=!this.profile.android;o.receiveShadow=true}});if(options.position)root.position.set(...options.position);if(options.scale)root.scale.setScalar(options.scale);this.world.add(root);return root}
destroy(){this.running=false;document.exitPointerLock?.();this.effects.clear();this.renderer.dispose()}
}
