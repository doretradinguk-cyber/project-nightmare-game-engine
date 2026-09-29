import { NightmareThreeRenderer } from './three-runtime.js';
import { mansion } from './mansion.js';
import { sceneState, enterRoom, setPower } from './scene-state.js';
import { createLayout } from './procedural-layout.js';

export function bootMansion(canvas, options = {}) {
  const renderer = new NightmareThreeRenderer(canvas);
  const seed = options.seed ?? Date.now();
  const layout = createLayout(seed, { maxPlayers: options.maxPlayers ?? 8, wings: options.wings ?? 3, roomsPerWing: options.roomsPerWing ?? 4 });
  renderer.setLayout(layout);
  renderer.setPower(sceneState.power);
  renderer.start();
  const resize = () => renderer.resize();
  window.addEventListener('resize', resize);
  return {
    renderer, world: mansion, state: sceneState, layout, seed,
    getRoom() { return renderer.getRoom(); },
    destroy() { window.removeEventListener('resize', resize); renderer.destroy(); },
    setPower(value) { setPower(value); renderer.setPower(value); },
    enterRoom(roomId) { return enterRoom(roomId); }
  };
}
