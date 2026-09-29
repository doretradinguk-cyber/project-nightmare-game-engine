import { NightmareRenderer } from './renderer.js';
import { mansion } from './mansion.js';
import { sceneState } from './scene-state.js';
import { NightmareInput } from './input.js';

export function bootMansion(canvas) {
  const renderer = new NightmareRenderer(canvas);
  const input = new NightmareInput(canvas);
  input.attachPointer(canvas);
  renderer.resize();
  renderer.clear();

  const resize = () => renderer.resize();
  window.addEventListener('resize', resize);

  return {
    renderer,
    world: mansion,
    state: sceneState,
    destroy() {
      window.removeEventListener('resize', resize);
    }
  };
}
