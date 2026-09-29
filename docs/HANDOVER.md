# Project Nightmare — Live Handover

**Updated:** 2026-09-29

**Asset-pack implementation commit:** `0a2df6a0b3f399c5bc225b694713685bc66ac361`

**Current phase:** Content Manager Integration — IN PROGRESS

## Completed this phase
- Content manager imported by the Mansion bootstrap.
- Core and Mansion logical packs are mounted during Mansion startup.
- Stable asset ID resolution is now connected to the renderer.
- Added an original, self-contained local GLTF triangle test asset.
- The sandbox startup waits on the content pipeline through `runtime.ready`.
- Non-redistributable assets remain blocked by the content manager.

## Current status
- [x] Logical pack architecture
- [x] Asset-pack manifest schema
- [x] Pack catalogue
- [x] Browser content manager foundation
- [x] Core/Mansion/Android pack placeholders
- [x] Content manager wired into Mansion bootstrap
- [x] Local GLTF pack-resolution test asset
- [x] Crash-safe handover record
- [ ] Browser pack import/build tooling
- [ ] SHA-256 build validation
- [ ] Android build wrapper / Play Asset Delivery mapping
- [ ] Windows release packaging
- [ ] DLC entitlement/ownership layer
- [ ] Physical Android compatibility test
- [ ] Low-memory Android test

## Known limitations / errors
1. Browser code cannot silently read arbitrary hard-drive folders; files must be explicitly selected/imported or supplied by a desktop/native pipeline.
2. The local test model is GLTF rather than binary GLB so it remains reviewable in source control; it is original and contains an embedded 36-byte triangle buffer.
3. The browser prototype has not yet been exercised on physical Android hardware.
4. Three.js remains a jsDelivr development import; release should vendor/pin it and retain the MIT notice.
5. The content manager currently resolves browser URLs. Native Android delivery will need a platform adapter that maps the same pack IDs to Play Asset Delivery locations.

## Exact resume point after a crash
NEXT STEP: add the browser pack import/build tooling, including explicit folder/file selection, manifest validation, redistribution checks and SHA-256 generation. Then map the logical Android pack names to Play Asset Delivery configuration.

Android's current documentation defines install-time, fast-follow and on-demand asset pack delivery, and says downloaded pack locations should be checked on every launch rather than cached between launches. citeturn0search1turn0search4

## Recovery rule
At the end of every substantial build phase update this file with phase/status, commits, completed work, known errors and the exact next step. Never leave an unfinished phase undocumented.
