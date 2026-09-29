import * as THREE from 'https://cdn.jsdelivr.net/npm/three@0.186.0/build/three.module.js';

export class SandboxExperience {
  constructor(runtime, hooks = {}) {
    this.r = runtime;
    this.hooks = hooks;
    this.pulse = 0;
    this.eventTimer = 0;
    this.eventActive = false;
    this.originalPower = runtime.power;
    this.buildAtmosphere();
  }

  mat(color, roughness = .8, metalness = 0, emissive = 0x000000, ei = 0) {
    return new THREE.MeshStandardMaterial({color, roughness, metalness, emissive, emissiveIntensity: ei});
  }

  mesh(g, geo, material, pos, rot = null) {
    const m = new THREE.Mesh(geo, material);
    m.position.set(...pos);
    if (rot) m.rotation.set(...rot);
    m.castShadow = !this.r.profile.android;
    m.receiveShadow = true;
    g.add(m);
    return m;
  }

  buildAtmosphere() {
    const r = this.r;
    const scene = r.scene;
    this.ambient = new THREE.Group();
    r.world.add(this.ambient);

    const wet = this.mat(0x202526, .38, .12);
    const concrete = this.mat(0x343637, .92);
    const steel = this.mat(0x3b4142, .52, .72);
    const black = this.mat(0x0c1010, .7, .2);
    const red = this.mat(0x180507, .45, .15, 0xff183b, 1.6);
    const green = this.mat(0x071208, .5, .05, 0x65ff55, 1.8);
    const white = this.mat(0x555858, .5, .05, 0xa9b4b5, .35);

    for (const n of r.layout.nodes) {
      const p = r.point(n), d = r.dims(n), g = new THREE.Group();
      g.position.copy(p);
      // Raised skirting and architectural bands.
      this.mesh(g, new THREE.BoxGeometry(d.w-.15,.18,.18), steel, [0,.16,-d.d/2+.08]);
      this.mesh(g, new THREE.BoxGeometry(d.w-.15,.18,.18), steel, [0,.16,d.d/2-.08]);
      this.mesh(g, new THREE.BoxGeometry(.18,.18,d.d-.15), steel, [-d.w/2+.08,.16,0]);
      this.mesh(g, new THREE.BoxGeometry(.18,.18,d.d-.15), steel, [d.w/2-.08,.16,0]);

      // Ceiling panels create depth rather than a flat box.
      for(let x=-d.w/2+1;x<d.w/2-1;x+=2.2) {
        this.mesh(g,new THREE.BoxGeometry(1.75,.06,d.d-.8),black,[x,H-.05,0]);
      }

      // Hanging fluorescent fixtures.
      for(let x=-d.w/2+1.4;x<d.w/2-1;x+=3.4) {
        const fixture=this.mesh(g,new THREE.BoxGeometry(1.5,.08,.34),white,[x,H-.22,0]);
        const lamp=new THREE.PointLight(n.type==='hub'?0xffd9ad:0xbfd8df,n.type==='hub'?2.3:1.25,7,2);
        lamp.position.set(x,H-.35,0);
        g.add(lamp);
      }

      // Door/terminal accents make rooms readable as spaces.
      if(n.type==='destination'||n.type==='study'||n.type==='security') {
        this.mesh(g,new THREE.BoxGeometry(1.9,2.65,.12),steel,[0,1.32,d.d/2-.11]);
        this.mesh(g,new THREE.BoxGeometry(1.55,.08,.08),red,[0,2.48,d.d/2-.18]);
      }

      // Procedural props: cabinets, crates and server blocks.
      const propCount=n.type==='hub'?5:3;
      for(let i=0;i<propCount;i++){
        const side=i%2?-1:1, x=side*(d.w*.34), z=-d.d*.25+i*.9;
        this.mesh(g,new THREE.BoxGeometry(.75,1.35,.65),i%3?steel:concrete,[x,.68,z]);
        this.mesh(g,new THREE.BoxGeometry(.54,.04,.05),i%2?green:red,[x,1.1,z+.34]);
      }
      r.world.add(g);
    }

    // Low-level emergency guide lights along the world.
    for (const n of r.layout.nodes) {
      const p=r.point(n), light=new THREE.PointLight(0xff263f,.35,5,2);
      light.position.set(p.x,0.35,p.z);
      this.ambient.add(light);
    }

    // Atmospheric particles: sparse dust, not a performance-heavy effect.
    const count=r.profile.android?90:220;
    const pos=new Float32Array(count*3);
    for(let i=0;i<count;i++){pos[i*3]=(Math.random()-.5)*150;pos[i*3+1]=Math.random()*5;pos[i*3+2]=(Math.random()-.5)*150;}
    const pg=new THREE.BufferGeometry();pg.setAttribute('position',new THREE.BufferAttribute(pos,3));
    const pm=new THREE.PointsMaterial({color:0xaab2ad,size:r.profile.android?.018:.026,transparent:true,opacity:.22,depthWrite:false});
    this.dust=new THREE.Points(pg,pm);scene.add(this.dust);

    scene.fog.color.set(0x030506);
    scene.fog.density=r.profile.android?.042:.027;
    this.r.hemi.color.set(0x7d8990);
    this.r.key.color.set(0x9eb0bd);
    this.r.key.intensity=.65;

    // A distant red beacon gives the Sandbox its Nightmare identity.
    this.beacon=new THREE.PointLight(0xff1744,3.5,24,2);
    this.beacon.position.set(0,3,-32);
    scene.add(this.beacon);
  }

  triggerEvent() {
    this.eventActive=true; this.eventTimer=0;
    this.hooks.status?.('NIGHTMARE EVENT // SIGNAL BREACH');
  }

  setPower(value) {
    this.r.setPower(value);
    this.hooks.telemetry?.('POWER', Math.round(this.r.power*100)+'%');
  }

  update(dt) {
    this.pulse+=dt;
    if(this.dust) this.dust.rotation.y+=dt*.006;
    if(this.beacon) this.beacon.intensity=2.2+Math.sin(this.pulse*5)*1.3;
    if(this.eventActive){
      this.eventTimer+=dt;
      const t=Math.min(1,this.eventTimer/5);
      this.beacon.intensity=7+Math.sin(this.pulse*18)*4;
      this.r.scene.fog.density=(this.r.profile.android?.042:.027)+Math.sin(t*Math.PI)*.035;
      if(t>=1){this.eventActive=false;this.r.scene.fog.density=this.r.profile.android?.042:.027;this.hooks.status?.('WORLD STABLE // EVENT CLEARED');}
    }
  }

  destroy(){
    this.dust?.geometry.dispose(); this.dust?.material.dispose();
    this.beacon?.removeFromParent();
  }
}