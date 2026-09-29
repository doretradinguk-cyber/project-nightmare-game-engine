import { NightmareThreeRenderer } from './three-runtime.js';
import { NightmareContentManager } from './content/content-manager.js';
import { mansion } from './mansion.js';
import { sceneState, enterRoom, setPower } from './scene-state.js';
import { createLayout } from './procedural-layout.js';

export function bootMansion(canvas, options = {}) {
  const renderer = new NightmareThreeRenderer(canvas);
  const content = new NightmareContentManager({ catalogUrl: options.catalogUrl ?? './data/assets/asset-catalog.json' });
  const seed = options.seed ?? Date.now();
  const layout = createLayout(seed, { maxPlayers: options.maxPlayers ?? 8, wings: options.wings ?? 3, roomsPerWing: options.roomsPerWing ?? 4 });

  renderer.setLayout(layout);
  renderer.setPower(sceneState.power);
  renderer.start();

  const ready = content.initialise()
    .then(() => content.mountPack('pn.pack.core'))
    .then(() => content.mountPack('pn.pack.mansion'))
    .then(() => {
      const testAsset = 'pn.test.content.triangle';
      if (content.hasAsset(testAsset) && options.loadContentTest !== false) {
        return renderer.loadGLTF(content.resolveUrl(testAsset), {
          position: [0, 1.2, -2.5],
          scale: 0.75
        });
      }
      return null;
    });

  const resize = () => renderer.resize();
  window.addEventListener('resize', resize);

  return {
    renderer, content, ready, world: mansion, state: sceneState, layout, seed,
    getRoom() { return renderer.getRoom(); },
    destroy() { window.removeEventListener('resize', resize); renderer.destroy(); },
    setPower(value) { setPower(value); renderer.setPower(value); },
    enterRoom(roomId) { return enterRoom(roomId); }
  };
}
