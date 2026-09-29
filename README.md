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

## Content-pack pipeline
The project now has a platform-neutral asset-pack foundation in `data/assets/` and `js/engine/content/content-manager.js`.

The intended pipeline is:

`HARD DRIVE MASTER -> LICENCE CHECK -> STAGE -> OPTIMISE -> VALIDATE -> PACK -> RELEASE`

Game systems reference stable asset IDs rather than developer hard-drive paths. The same logical pack can later map to browser content, a Windows package, Android Play Asset Delivery, or platform DLC/depot delivery without rewriting gameplay code.

See `assets/packs/README.md` and `docs/HANDOVER.md` for the current workflow and exact recovery point.

## Platform delivery direction
Android Play Asset Delivery supports install-time, fast-follow and on-demand asset packs. citeturn0search2 Steam uses logical depots that are delivered and mounted separately, including DLC depots. citeturn0search0

The current browser build deliberately uses ordinary folders/manifests first. Native Android/Windows packaging comes later, after the content contract is stable.

See `data/performance/graphics-stack.md` for the graphics roadmap.
