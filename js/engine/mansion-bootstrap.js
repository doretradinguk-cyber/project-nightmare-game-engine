import { NightmareThreeRenderer } from './three-runtime.js';
import { NightmareContentManager } from './content/content-manager.js';
import { mansion } from './mansion.js';
import { sceneState, enterRoom, setPower } from './scene-state.js';
import { createLayout } from './procedural-layout.js';

export function bootMansion(canvas, options = {}) {
  const progress = typeof options.onProgress === 'function' ? options.onProgress : () => {};
  progress(8, 'BUILDING MANSION...', 'PROCEDURAL GRAPH INITIALISING');
  const renderer = new NightmareThreeRenderer(canvas);
  const content = new NightmareContentManager({ catalogUrl: options.catalogUrl ?? '../data/assets/asset-catalog.json' });
  const seed = options.seed ?? Date.now();
  const layout = createLayout(seed, { maxPlayers: options.maxPlayers ?? 8, wings: options.wings ?? 3, roomsPerWing: options.roomsPerWing ?? 4 });

  renderer.setLayout(layout);
  progress(28, 'WORLD GEOMETRY READY', `${layout.nodes.length} NODES // ${layout.edges.length} LINKS`);
  renderer.setPower(sceneState.power);
  renderer.start();

  const ready = content.initialise()
    .then(() => { progress(52, 'ASSET CATALOG READY', 'CONTENT INDEX BUFFERED'); return content; })
    .then(() => content.mountPack('pn.pack.core'))
    .then(() => { progress(68, 'CORE PACK BUFFERED', 'REUSABLE ASSETS ONLINE'); return content; })
    .then(() => content.mountPack('pn.pack.mansion'))
    .then(() => { progress(86, 'MANSION PACK BUFFERED', 'ROOM CONTENT INDEXED'); return content; })
    .then(() => {
      const testAsset = options.testAsset ?? null;
      if (testAsset && content.hasAsset(testAsset) && options.loadContentTest !== false) {
        return renderer.loadGLTF(content.resolveUrl(testAsset), {
          position: [0, 1.2, -2.5],
          scale: 0.75
        });
      }
      return null;
    })
    .then(result => { progress(96, 'FINALISING BUFFER...', 'RENDER PIPELINE SYNCHRONISING'); return result; });

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
