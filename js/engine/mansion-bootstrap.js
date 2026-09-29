import { NightmareRenderer } from './renderer.js';
import { mansion } from './mansion.js';
import { sceneState, enterRoom, setPower } from './scene-state.js';
import { NightmareInput } from './input.js';
import { createLayout } from './procedural-layout.js';

export function bootMansion(canvas, options={}){
  const renderer=new NightmareRenderer(canvas);
  const input=new NightmareInput(canvas);
  const seed=options.seed ?? Date.now();
  const layout=createLayout(seed,{maxPlayers:options.maxPlayers??8,wings:options.wings??3,roomsPerWing:options.roomsPerWing??4});
  renderer.setLayout(layout);
  input.attachPointer(canvas);
  const keys=renderer.keys;
  window.addEventListener('keydown',e=>keys.add(e.code));
  window.addEventListener('keyup',e=>keys.delete(e.code));
  renderer.resize();
  renderer.start();

  const resize=()=>renderer.resize();
  const pointer=e=>{
    if(document.pointerLockElement!==canvas) return;
    renderer.camera.yaw-=e.movementX*0.0022;
    renderer.camera.pitch-=e.movementY*0.0018;
    renderer.camera.pitch=Math.max(-1.35,Math.min(1.35,renderer.camera.pitch));
  };
  canvas.addEventListener('mousemove',pointer);
  canvas.addEventListener('click',()=>canvas.requestPointerLock?.());

  return {
    renderer,world:mansion,state:sceneState,layout,seed,
    getRoom(){ return renderer.getRoom(); },
    destroy(){
      window.removeEventListener('resize',resize);
      window.removeEventListener('keydown',e=>keys.delete(e.code));
      window.removeEventListener('keyup',e=>keys.delete(e.code));
      canvas.removeEventListener('mousemove',pointer);
      document.exitPointerLock?.();
    },
    setPower(value){ setPower(value); renderer.setPower(value); },
    enterRoom(roomId){ return enterRoom(roomId); }
  };
}
