# Project Nightmare — Live Handover

**Updated:** 2026-09-29

## Current phase
### Asset Pack Foundation — IMPLEMENTED

The project now has a platform-neutral content-pack contract for core content, optional world content, platform-specific content and future DLC.

## Added

- data/assets/asset-pack-schema.json — pack metadata contract and redistribution gate.
- data/assets/asset-catalog.json — logical pack catalogue.
- data/assets/packs/core.json — core placeholder.
- data/assets/packs/mansion.json — Mansion placeholder.
- data/assets/packs/android.json — Android placeholder.
- js/engine/content/content-manager.js — catalogue loading, dependency mounting and asset-ID resolution.
- assets/packs/README.md — master-library to release-pack workflow.
- This handover record.

## Architecture decision

The engine references asset IDs, never developer hard-drive paths.

Example: pn.mansion.prop.cctv_01

That ID can eventually resolve to a browser folder, Windows package, Android Play Asset Pack or another backend without changing gameplay code.

Android supports install-time, fast-follow and on-demand asset packs; Steam uses separately delivered/mounted depots and DLC depots. citeturn0search2turn0search0

## Hard-drive workflow

Master: D:\ProjectNightmare\AssetLibrary\
Working: D:\ProjectNightmare\AssetBuild\

DOWNLOAD -> MASTER -> LICENCE CHECK -> STAGE -> OPTIMISE -> VALIDATE -> BUILD PACK -> RELEASE

## Status

- [x] Logical pack architecture
- [x] Asset-pack manifest schema
- [x] Pack catalogue
- [x] Browser content manager foundation
- [x] Core/Mansion/Android pack placeholders
- [x] Licence gate in content resolution
- [x] Crash-safe handover record
- [ ] Connect content manager to live Mansion renderer
- [ ] Add cleared GLB/texture/audio assets
- [ ] Add SHA-256 build validation
- [ ] Add browser pack import/build tooling
- [ ] Add Android build wrapper / Play Asset Delivery mapping
- [ ] Add Windows release packaging
- [ ] Add DLC entitlement/ownership layer
- [ ] Test physical Android hardware
- [ ] Test low-memory Android behaviour

## Known limitations / errors

1. Browser code cannot silently read arbitrary hard-drive folders. Files must be explicitly selected/imported or supplied by a desktop/native pipeline.
2. Packs intentionally contain no external assets yet, preventing accidental redistribution of uncleared content.
3. Content manager is not yet wired into mansion-bootstrap.js.
4. Android compatibility is not yet verified on physical hardware.
5. Three.js is still a jsDelivr development import; release should vendor/pin it and retain the MIT notice.

## Exact resume point after a crash

NEXT STEP: integrate js/engine/content/content-manager.js into mansion-bootstrap.js, mount pn.pack.core and pn.pack.mansion, then add one known-safe local test GLB through the pack resolver.

After that:
1. Add pack import/build tooling.
2. Add licence validation and SHA-256 checks.
3. Begin Android compatibility pass.
4. Do not add third-party assets to release packs until redistribution status is recorded.

## Recovery rule

At the end of every substantial build phase update this file with phase/status, commits, completed work, known errors and the exact next step. Never leave an unfinished phase undocumented.
