# Project Nightmare — Asset & Runtime Licences

## Three.js
- Licence: MIT.
- Version targeted: 0.186.0.
- Official repository: https://github.com/mrdoob/three.js
- Current development import: jsDelivr.
- Redistributed copies must retain the Three.js MIT licence notice.

## Poly Haven
- HDRIs, textures and 3D models: CC0.
- Commercial use permitted; attribution not required for the CC0 assets.
- Source: https://polyhaven.com/license
- Project policy: download selected assets and self-host them for released builds.

## Kenney
- Use approved game asset packs and record the exact pack licence/source before import.
- Source: https://kenney.nl/

## Quaternius
- Use CC0 packs and record the exact pack/source before import.
- Source: https://quaternius.com/

## Pack-level release policy
Every asset entering a release pack must record:
- stable asset ID
- source URL/name
- original filename
- licence
- commercial use status
- redistribution status
- modification status
- date added
- optional SHA-256
- pack ID

An asset marked `redistributable: false` must never be included in a released content pack.

## Project rules
1. No ripped game assets, famous characters, branded content or copied UI.
2. Record source, licence, original filename, local filename, date added and modifications for every external asset.
3. Prefer CC0 assets for commercial content.
4. Prefer local/self-hosted assets over live third-party APIs in shipped builds.
5. Original Project Nightmare assets remain Dore Trading UK property unless separately documented.
6. Keep master source assets outside the repository; commit only cleared release content and the metadata needed to reproduce it.
