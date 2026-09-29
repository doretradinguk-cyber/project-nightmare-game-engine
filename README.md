# Project Nightmare Game Engine

Original browser-based horror game engine and development control centre for Dore Trading UK.

## UI
Dashboard + six tool cards: Sprite Matrix, Game Console, Voice Scripting, Database & Admin Bridge, Dev Page and Virtual Sandbox.

## Architecture
The repository separates UI, engine systems, assets, audio, sprites, database/pipeline data, AI prompts, development tools and sandbox environments.

Design direction: dark dystopian horror. All project artwork, characters and interface designs are original; external games are reference only for genre atmosphere and presentation.


## Graphics upgrade milestone
The engine now includes a Three.js-based visual renderer as the active upgrade path. It provides physically based materials, room/corridor lighting, shadows, fog, tone mapping and GLTF/GLB loading. The original low-level WebGL renderer remains available as a fallback during the transition.

The Asset Vault can feed GLTF assets through `js/engine/asset-loader.js`. External runtime and asset licensing is tracked in `ASSET-LICENSES.md`.

See `data/performance/graphics-stack.md` for the graphics roadmap.
