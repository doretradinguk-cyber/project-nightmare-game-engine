# Project Nightmare Asset Database

Project Nightmare now has a browser-persistent IndexedDB asset vault.

## What it stores

- PNG/JPG/WebP/SVG artwork
- animation/video assets
- MP3/WAV/OGG audio
- JSON configuration
- text and development data

## Storage model

Database: `project-nightmare-assets`

Object store: `assets`

Every stored asset has:

- stable ID
- name
- type
- category
- MIME type
- byte size
- tags
- description
- engine path
- version
- created/updated timestamps
- binary Blob
- extensible metadata

## Engine API

Use `js/database/asset-store.js`.

Core APIs:

- `saveAsset()`
- `getAsset()`
- `getAssetBlob()`
- `getAssetUrl()`
- `listAssets()`
- `deleteAsset()`
- `assetVaultStats()`
- `classifyFile()`

The same stable asset ID can be referenced by the Dev Page, Sprite Matrix, Voice Scripting, Virtual Sandbox and future game runtime.

## Persistence boundary

This is a **local browser database**. It survives page reloads and normal browser restarts for the same browser profile.

It is **not yet a remote/server database** and is not automatically shared between different computers.

A future server-backed service can retain this metadata contract and stable IDs.

## Recommended categories

- characters
- environments
- ui
- backgrounds
- textures
- sprites
- animations
- audio
- data
- prompts
- prototypes

The asset vault is the canonical browser-side source of truth for uploaded assets.
