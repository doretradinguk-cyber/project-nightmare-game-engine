# Project Nightmare Content Packs

This directory is the release-side staging contract, not the master asset library.

## Storage model

Master source:
D:\ProjectNightmare\AssetLibrary\

Working build:
D:\ProjectNightmare\AssetBuild\

Repository packs contain only assets cleared for redistribution.

## Pack lifecycle

DOWNLOAD -> MASTER -> LICENCE CHECK -> STAGE -> OPTIMISE -> VALIDATE -> BUILD PACK -> RELEASE

Every released asset needs a stable asset ID, source/original filename, licence reference, commercial-use status, redistribution status, modification status and optional SHA-256 hash.

## Delivery policy

- pn.pack.core — essential content
- pn.pack.mansion — Mansion world
- pn.pack.android — Android-specific optimisation/content

For the browser prototype these are folders and JSON manifests.

For Android, these logical packs can later map to Play Asset Delivery install-time, fast-follow or on-demand modes. citeturn0search2

For Windows/Steam, they can later map to separately delivered depots/DLC content. Steam documents depots as logical file groups mounted for an installed game. citeturn0search0

Do not make the game depend on third-party asset URLs at runtime.

A free asset is not automatically cleared for redistribution. The manifest must explicitly mark redistributable: true after licence review.
