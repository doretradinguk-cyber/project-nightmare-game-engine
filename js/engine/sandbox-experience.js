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
    this.buildSentinelEyes();
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

    const links = new Map(r.layout.nodes.map(n => [n.id, []]));
    for (const e of r.layout.edges) {
      links.get(e.from)?.push(e.to);
      links.get(e.to)?.push(e.from);
    }

    for (const n of r.layout.nodes) {
      const p = r.point(n), d = r.dims(n), g = new THREE.Group();
      g.position.copy(p);

      // Keep the normal mansion architectural and uncluttered.
      const steel = this.mat(0x3b4142, .58, .55);
      const black = this.mat(0x0c1010, .7, .2);
      const white = this.mat(0x555858, .5, .05, 0xa9b4b5, .25);
      const accent = this.mat(0x242829, .8, .05);

      // Subtle architectural trim only; it never occupies the walking lane.
      this.mesh(g, new THREE.BoxGeometry(d.w-.15,.18,.18), steel, [0,.16,-d.d/2+.08]);
      this.mesh(g, new THREE.BoxGeometry(d.w-.15,.18,.18), steel, [0,.16,d.d/2-.08]);
      this.mesh(g, new THREE.BoxGeometry(.18,.18,d.d-.15), steel, [-d.w/2+.08,.16,0]);
      this.mesh(g, new THREE.BoxGeometry(.18,.18,d.d-.15), steel, [d.w/2-.08,.16,0]);

      for(let x=-d.w/2+2.2;x<d.w/2-1.2;x+=3.8) {
        this.mesh(g,new THREE.BoxGeometry(2.1,.06,d.d-.9),black,[x,H-.05,0]);
      }

      // Fewer, wider-spaced lights: readable architecture before atmosphere.
      for(let x=-d.w/2+2;x<d.w/2-1;x+=5.2) {
        this.mesh(g,new THREE.BoxGeometry(1.7,.08,.34),white,[x,H-.22,0]);
        const lamp=new THREE.PointLight(n.type==='hub'?0xffd9ad:0xd6d9d6,n.type==='hub'?2.3:.85,8,2);
        lamp.position.set(x,H-.35,0);
        g.add(lamp);
      }

      // Only technical rooms get technical dressing.
      if(n.archetype==='security'||n.archetype==='machine-room') {
        this.mesh(g,new THREE.BoxGeometry(1.25,1.65,.55),accent,[0,.83,d.d/2-.45]);
      }

      // At most one floor prop per room, placed against a wall away from the doorway.
      const propAllowed = n.type==='hub' || n.zone==='formal' || n.zone==='service';
      const sparse = n.archetype!=='storage' && n.archetype!=='machine-room';
      if(propAllowed && sparse) {
        const neighbours = links.get(n.id)||[];
        const doorSides = neighbours.map(id => r.layout.nodes.find(q=>q.id===id)).filter(Boolean)
          .map(q => ({x:Math.sign(q.x-n.x),z:Math.sign(q.z-n.z)}));
        const has = (x,z) => doorSides.some(s => s.x===x && s.z===z);
        let x=0,z=0;
        if(!has(1,0)) x=d.w/2-.58;
        else if(!has(-1,0)) x=-d.w/2+.58;
        else if(!has(0,1)) z=d.d/2-.58;
        else z=-d.d/2+.58;
        this.mesh(g,new THREE.BoxGeometry(.72,1.1,.62),accent,[x,.55,z]);
      }

      r.world.add(g);
    }
    // Normal mode stays visually calm. Nightmare effects can add the red signal later.

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
    this.beacon=new THREE.PointLight(0xff1744,.8,18,2);
    this.beacon.position.set(0,3,-32);
    scene.add(this.beacon);
  }

  buildSentinelEyes() {
    const loader = new THREE.TextureLoader();
    const texture = loader.load('../../assets/props/nightmare-eye.svg');
    texture.colorSpace = THREE.SRGBColorSpace;
    this.sentinelEyes = [];
    const hub = this.r.layout.nodes.find(n => n.type === 'hub') || this.r.layout.nodes[0];
    if (!hub) return;
    const p = this.r.point(hub), d = this.r.dims(hub);
    const specs = [
      { side: -1, position: [p.x - d.w/2 + .09, 2.35, p.z], rotation: [0, Math.PI/2, 0], name: 'LEFT WALL EYE' },
      { side: 1, position: [p.x + d.w/2 - .09, 2.35, p.z], rotation: [0, -Math.PI/2, 0], name: 'RIGHT WALL EYE' }
    ];
    for (const spec of specs) {
      const group = new THREE.Group();
      group.position.set(...spec.position);
      group.rotation.set(...spec.rotation);
      const frame = new THREE.Mesh(
        new THREE.BoxGeometry(2.35, 1.45, .16),
        this.mat(0x080a0a, .48, .25, 0x140000, .4)
      );
      frame.position.z = .02;
      group.add(frame);
      const eye = new THREE.Mesh(
        new THREE.PlaneGeometry(2.1, 1.18),
        new THREE.MeshBasicMaterial({map: texture, transparent: true, side: THREE.DoubleSide})
      );
      eye.position.z = .115;
      group.add(eye);
      const pupil = new THREE.Mesh(
        new THREE.SphereGeometry(.16, 12, 8),
        this.mat(0x050505, .25, .1, 0xff294d, 2.5)
      );
      pupil.position.set(0, 0, .17);
      group.add(pupil);
      const halo = new THREE.PointLight(0xff294d, .35, 4, 2);
      halo.position.z = .3;
      group.add(halo);
      group.userData = {pupil,halo,baseZ:.17,locked:false,cooldown:0,name:spec.name};
      this.r.world.add(group);
      this.sentinelEyes.push(group);
    }
    this.sentinelStateKey = 'project-nightmare:sandbox:sentinel-eyes:v2';
    try { this.sentinelState = JSON.parse(localStorage.getItem(this.sentinelStateKey) || '{"leftLocks":0,"rightLocks":0}'); } catch { this.sentinelState = {leftLocks:0,rightLocks:0}; }
  }

  updateSentinelEyes(dt) {
    if (!this.sentinelEyes?.length) return;
    const camera = this.r.camera;
    const camPos = camera.position;
    const forward = new THREE.Vector3(0,0,-1).applyQuaternion(camera.quaternion);
    for (const eye of this.sentinelEyes) {
      const u = eye.userData;
      u.cooldown = Math.max(0, u.cooldown - dt);
      const worldNormal = new THREE.Vector3(0,0,1).applyQuaternion(eye.quaternion);
      const toEye = eye.position.clone().sub(camPos).normalize();
      const visible = forward.dot(toEye) > .965;
      const localTarget = eye.worldToLocal(camPos.clone());
      const maxX = .34, maxY = .22;
      const len = Math.hypot(localTarget.x, localTarget.y) || 1;
      const scale = Math.min(1, .55 / len);
      u.pupil.position.x = THREE.MathUtils.clamp(localTarget.x * scale, -maxX, maxX);
      u.pupil.position.y = THREE.MathUtils.clamp(localTarget.y * scale, -maxY, maxY);
      u.pupil.position.z = u.baseZ + Math.max(0, Math.min(.07, localTarget.z * .008));
      u.halo.intensity = u.locked ? 1.8 + Math.sin(this.pulse*18)*.7 : .25 + Math.sin(this.pulse*3)*.08;
      if (visible && u.cooldown <= 0 && !u.locked) {
        u.locked = true;
        u.cooldown = 1.8;
        const key = eye.position.x < 0 ? 'leftLocks' : 'rightLocks';
        this.sentinelState[key]++;
        try { localStorage.setItem(this.sentinelStateKey, JSON.stringify(this.sentinelState)); } catch {}
        this.hooks.status?.('SENTINELS LOCKED // STATE SAVED');
        setTimeout(() => { u.locked = false; }, 520);
      }
      if (u.locked) {
        const pulse = 1 + Math.sin(this.pulse*24)*.045;
        eye.scale.set(pulse,pulse,1);
      } else eye.scale.set(1,1,1);
    }
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
    this.updateSentinelEyes(dt);
    if(this.dust) this.dust.rotation.y+=dt*.006;
    if(this.beacon) this.beacon.intensity=.65+Math.sin(this.pulse*2.5)*.2;
    if(this.eventActive){
      this.eventTimer+=dt;
      const t=Math.min(1,this.eventTimer/5);
      this.beacon.intensity=7+Math.sin(this.pulse*18)*4;
      this.r.scene.fog.density=(this.r.profile.android?.018:.012)+Math.sin(t*Math.PI)*.035;
      if(t>=1){this.eventActive=false;this.r.scene.fog.density=this.r.profile.android?.018:.012;this.hooks.status?.('WORLD STABLE // EVENT CLEARED');}
    }
  }

  destroy(){
    this.dust?.geometry.dispose(); this.dust?.material.dispose();
    for(const eye of this.sentinelEyes||[]) eye.removeFromParent();
    this.beacon?.removeFromParent();
  }
}