# PROJECT NIGHTMARE — NEXT BUILD HANDOVER

**Repository:** `doretradinguk-cyber/project-nightmare-game-engine`  
**GitHub Pages:** `https://doretradinguk-cyber.github.io/project-nightmare-game-engine/`  
**Project:** Project Nightmare  
**Owner:** Dore Trading UK  
**Working language:** British English  
**Current branch:** `main`

---

## 1. PURPOSE OF THIS FILE

This document is the recovery point for the Project Nightmare build.

If a conversation, AI session, browser session, or development handover is interrupted, read this file first. It records the current architecture, design direction, completed work, non-negotiable requirements, and the next implementation stage.

**Do not restart the project from scratch. Continue from the current repository state.**

---

## 2. CURRENT PROJECT VISION

Project Nightmare is a browser-based horror game / game-engine project built with **HTML, CSS and JavaScript**.

The target is a cinematic, atmospheric, replayable horror experience combining:

- grounded domestic / industrial horror
- cinematic survival-horror presentation
- tactical surveillance systems
- retro digital horror
- procedural level generation
- adaptive architecture
- multiplayer gameplay
- the original Laughing Jester entity

The game must feel like a real 3D environment rather than a collection of flat screens or repeated square rooms.

---

## 3. CORE DESIGN INSPIRATIONS

The project takes **inspiration only** from established horror/game design ideas.

Approved reference influences include:

- Chilla's Art — grounded environmental horror and atmosphere
- Resident Evil — cinematic survival-horror structure
- Metal Gear Solid — surveillance, security and tactical information
- Blue Prince — replayable procedural room/route generation

### ORIGINALITY RULE

Project Nightmare must **never copy**:

- characters
- maps
- interfaces
- dialogue
- music
- textures
- logos
- proprietary assets
- scenes
- distinctive copyrighted designs

All final characters, environments, systems, visual assets and narrative elements must be original Project Nightmare work.

---

## 4. FOUR MAIN WORLD PILLARS

### 4.1 Living Architecture

The environment is not static.

Rooms, corridors, doors, lighting and environmental details can react to player actions and world events.

Future architecture events include:

- walls crushing inward
- corridors twisting
- impossible loops
- rooms changing connections
- lights failing/flickering
- environmental reveals
- adaptive room states

### 4.2 Surveillance Network

The mansion contains a surveillance network.

Planned systems include:

- CCTV cameras
- room IDs
- motion detection
- signal strength
- corrupted feeds
- event timestamps
- predictive frames
- security terminals

Predictive surveillance may show an event shortly before it physically happens.

### 4.3 Nightmare Console

The development/control interface exists as part of the game's fiction.

It can expose:

- environment state
- rooms
- assets
- surveillance
- security
- memory/state
- world events
- development/debug information

### 4.4 The Laughing Jester

The Jester is the signature original horror entity.

Manifestation progression:

1. rain
2. pattern
3. face
4. silhouette
5. displacement
6. physical manifestation

The visual language uses a retro/pixel-inspired angular silhouette with a split red/green signal identity.

---

## 5. MULTIPLAYER REQUIREMENT

**Multiplayer is a major requirement, not an optional later add-on.**

Most levels and game modes will support multiplayer.

### Player limit

- Maximum: **8 players**
- Actual player count depends on game mode.

The architecture must therefore be designed so multiplayer can be integrated into:

- procedural generation
- spawn allocation
- room access
- events
- surveillance
- entity encounters
- collision
- networking/state synchronisation

Do not build systems that assume a single player permanently.

---

## 6. PROCEDURAL REPLAYABILITY REQUIREMENT

Levels must be replayable.

The same level should be able to generate a different layout when:

- the player dies
- a new run begins
- a new seed is selected

The procedural design is inspired by the **concept** of replayable room/route generation.

### IMPORTANT

Do **NOT** generate a simple:

`ROOM -> ROOM -> ROOM -> ROOM`

square-box maze.

The generated environment should feel architectural and organic.

It should contain combinations of:

- central hubs
- corridors
- staircases
- wings
- side rooms
- galleries
- studies
- storage spaces
- destination rooms
- branches
- loops
- alternate routes
- controlled dead ends
- landmarks

The player should feel that the building has a believable structure even though its exact layout changes.

---

## 7. CURRENT PROCEDURAL FOUNDATION

File:

`js/engine/procedural-layout.js`

The current generator already supports:

- deterministic seeds
- 2–5 wings
- 3–7 rooms per wing
- central hub
- different room types
- side rooms
- loops
- stair placements
- destination rooms
- up to 8 player slots

File:

`data/world/generation-rules.json`

Current design rules include:

- minimum wings: 2
- maximum wings: 5
- rooms per wing: 3–7
- central hub required
- loops allowed
- side rooms allowed
- stairs allowed
- dead-end overuse avoided
- player separation preserved
- future architecture events supported
- future environment: `carnival-nightmare`

### NEXT CRITICAL STEP

The graph generator must now be converted into **actual 3D geometry**.

The next implementation must not stop at graph data.

---

## 8. CURRENT ENGINE STATE

### Renderer

File:

`js/engine/renderer.js`

Current state:

- WebGL context foundation exists
- canvas resize exists
- platform-aware resolution exists
- renderer is **not yet a complete 3D renderer**

This is important.

### DO NOT CLAIM

The Mansion is already a finished 3D environment.

It is currently a WebGL foundation awaiting the actual geometry/camera/rendering stage.

---

## 9. MANSION FOUNDATION

Files:

- `js/engine/mansion.js`
- `js/engine/scene-state.js`
- `js/engine/mansion-bootstrap.js`
- `data/environments/mansion.json`
- `pages/sandbox.html`
- `css/sandbox.css`

The original Mansion environment contains conceptual rooms including:

- Foyer
- East Hall
- Study
- Service Stairs
- Lower Level
- Security Room

These are now being superseded/extended by the procedural layout system.

The Mansion should become the first proper generated 3D environment.

---

## 10. CROSS-PLATFORM REQUIREMENT

The same codebase targets:

- Windows / desktop browser
- Android browser

Desktop input:

- WASD
- mouse look
- pointer lock

Android input:

- touch movement
- touch look
- future virtual controls

Future:

- controller support

Platform adaptation already exists in:

`js/engine/platform.js`

Current adaptive concepts:

- dynamic resolution
- pixel-ratio cap
- dynamic-light budget
- particle budget
- shadow quality

### IMPORTANT

Do not sacrifice the desktop visual target to make Android work.

Use scalable quality settings instead.

---

## 11. EXISTING INPUT FOUNDATION

File:

`js/engine/input.js`

Already supports:

- keyboard state
- WASD movement axes
- mouse movement
- pointer lock
- cleanup

The next stage should turn this into a proper first-person controller with:

- camera position
- yaw
- pitch
- movement speed
- acceleration/deceleration
- collision
- gravity
- stairs
- room transitions

Touch controls should be added without breaking desktop controls.

---

## 12. WORLD EVENTS

File:

`js/engine/events.js`

Future Carnival events are already identified:

- `crush-walls`
- `twist-corridor`
- `flicker-reveal`

These are deliberately represented as reusable world events.

The event architecture should eventually allow events to operate on generated geometry instead of being hard-coded to one map.

---

## 13. FUTURE CARNIVAL NIGHTMARE

Environment name:

`carnival-nightmare`

Required future behaviour:

- walls can crush the player
- corridors can twist
- architecture can become surreal
- lights can flicker
- routes can change
- rooms can appear/disappear/change connection
- procedural variation should continue
- existing event systems should be reusable

The Mansion architecture should therefore be designed as a foundation for Carnival rather than a one-off system.

---

## 14. NEXT BUILD ORDER

Continue in this order unless a later requirement makes a change necessary.

### STAGE 1 — REAL 3D GEOMETRY

Build a modular WebGL geometry system capable of creating:

- floor meshes
- ceiling meshes
- walls
- door openings
- corridor sections
- rooms
- stairs
- architectural transitions
- landmarks

Convert the procedural graph into actual world coordinates.

### STAGE 2 — FIRST-PERSON CAMERA

Implement:

- camera transform
- yaw/pitch
- WASD movement
- mouse look
- gravity
- collision
- stairs
- room detection

### STAGE 3 — ORGANIC ARCHITECTURE

Make generated rooms vary in:

- width
- length
- ceiling height
- corridor width
- doorway placement
- lighting
- landmark placement

Avoid visual repetition.

### STAGE 4 — LIGHTING / ATMOSPHERE

Add:

- ambient darkness
- room-specific light levels
- power state
- flickering lights
- fog
- shadows where platform budget permits
- subtle environmental movement

### STAGE 5 — PROCEDURAL PLAYER SPAWNS

For up to 8 players:

- allocate valid spawn positions
- avoid spawning players on top of each other
- support separation across wings
- keep routes discoverable
- allow game modes to control spawn strategy

### STAGE 6 — SURVEILLANCE

Place cameras based on generated:

- rooms
- corridors
- landmarks
- important routes

Connect generated room IDs to surveillance state.

### STAGE 7 — ADAPTIVE ARCHITECTURE

Add event-driven changes to generated geometry.

Examples:

- door locks
- corridor changes
- lights failing
- walls moving
- alternate route opening
- impossible loop appearing

### STAGE 8 — JESTER

Connect the Jester manifestation stages to:

- surveillance
- player actions
- architecture events
- darkness
- rain/glyph effects
- predictive frames

### STAGE 9 — SANDBOX TOOLS

Add controls for:

- seed
- new run
- player count
- game mode
- environment
- procedural regeneration
- debug map
- room IDs
- event testing

---

## 15. RECOMMENDED 3D ARCHITECTURE

Keep the engine modular.

Suggested future structure:

`js/engine/`
- renderer.js
- camera.js
- geometry.js
- materials.js
- lighting.js
- collision.js
- first-person.js
- procedural-layout.js
- procedural-geometry.js
- multiplayer.js
- spawn-system.js
- events.js
- scene-state.js
- mansion.js
- mansion-bootstrap.js
- platform.js
- input.js

Do not create one giant JavaScript file.

---

## 16. PERFORMANCE RULES

The engine must remain scalable.

### Desktop

Target:

- higher resolution
- more dynamic lights
- higher shadow quality
- larger particle budget
- richer fog/effects

### Android

Target:

- reduced pixel ratio
- fewer dynamic lights
- reduced shadow quality
- reduced particle count
- optimised fog
- touch controls

The game must remain playable when quality settings are reduced.

---

## 17. EXISTING UI / ENGINE PAGES

Dashboard pages already established include:

1. Sprite Matrix
2. Game Console
3. Voice Scripting
4. Database & Admin Bridge
5. Dev Page
6. Virtual Sandbox

The Virtual Sandbox is the main environment testing area.

Do not remove existing dashboard functionality while building the 3D engine.

---

## 18. CURRENT REPOSITORY MAP

Important current paths:

`index.html`

`css/`
- main.css
- nightmare.css
- sandbox.css

`js/app.js`

`js/core/`
- bootstrap.js
- state.js
- router.js
- storage.js

`js/ui/`
- shell.js
- pages.js

`js/world/`
- nightmare-world.js
- surveillance.js
- jester.js

`js/engine/`
- renderer.js
- mansion.js
- scene-state.js
- mansion-bootstrap.js
- platform.js
- input.js
- events.js
- procedural-layout.js
- multiplayer.js

`pages/`
- sprite-matrix.html
- game-console.html
- voice-scripting.html
- database-admin.html
- dev.html
- sandbox.html

`data/world/`
- nightmare-world.md
- surveillance-network.md
- jester-spec.md
- generation-rules.json

`data/environments/`
- mansion.json

`data/performance/`
- platform-profiles.json

`assets/characters/`
- nightmare-jester.svg

---

## 19. COMPLETED MERGED BUILDS

### PR #1
**Build Project Nightmare hybrid horror foundation**

Merge commit:

`24a477536f5fbec5c751d5c2580ec81adb77ca12`

Established:

- world pillars
- visual identity
- surveillance concept
- Jester specification
- original Jester asset
- dashboard horror presentation

### PR #2
**Build Mansion 3D sandbox foundation**

Merge commit:

`9dffe6f3a02196a1762a35c47ea2b7300d69d326`

Established:

- WebGL renderer foundation
- Mansion data
- scene state
- sandbox environment page
- Mansion bootstrap

### PR #3
**Build cross-platform Nightmare engine foundation**

Merge commit:

`ffb7e7fa08d9d05277af4c7af92c2e58651f9bb4`

Established:

- desktop/Android profiles
- adaptive resolution
- input foundation
- future Carnival event definitions

### PR #4
**Build procedural multiplayer world foundation**

Latest known merge commit:

`e11348ff5a7b2f38305918e914c5d419730dd551`

Established:

- seeded procedural layouts
- wings
- rooms
- corridors
- side rooms
- loops
- stairs
- destination rooms
- multiplayer state
- 8-player limit
- generation rules
- replayable layout foundation

---

## 20. CURRENT KNOWN LIMITATION

The major missing piece is **actual 3D rendering**.

The current procedural system describes the world as data/graph nodes.

The next build must make those nodes visible as a real navigable 3D environment.

This is the correct next milestone.

---

## 21. DO NOT REGRESS THESE REQUIREMENTS

Never remove or silently weaken:

- maximum 8-player architecture
- multiplayer-first design
- procedural replayability
- seeded generation
- organic layouts
- corridors
- wings
- staircases
- branches
- loops
- landmarks
- adaptive architecture
- surveillance
- Jester
- Android support
- desktop support
- future Carnival compatibility
- original-art requirement

Never turn the procedural mansion into a repetitive grid of identical boxes.

---

## 22. DEVELOPMENT PRINCIPLE

Think like both:

**A senior 3D horror-game environment designer**

and

**a senior browser/game-engine programmer.**

Every new system should answer both questions:

1. Does this make the game more believable, atmospheric, replayable or frightening?
2. Is the implementation modular, scalable and reusable?

Avoid adding technology merely because it is technically impressive.

Build systems that contribute to the actual game.

---

## 23. HANDOVER INSTRUCTION FOR THE NEXT SESSION

If this project is resumed after interruption:

1. Read this file.
2. Inspect the current `main` branch.
3. Verify the latest commit rather than assuming this document is newer.
4. Preserve the existing architecture.
5. Continue with **actual 3D geometry generation from the procedural graph**.
6. Do not rebuild the project from scratch.
7. Do not replace the procedural system with a simple room grid.
8. Commit coherent stages to GitHub.
9. Keep the Virtual Sandbox usable throughout the build.
10. Update this handover document when major architecture changes occur.

---

## 24. CURRENT NEXT TASK

**BUILD THE PROCEDURAL 3D MANSION.**

The graph already exists.

Now turn it into:

**hub → wings → corridors → rooms → stairs → loops → landmarks → navigable 3D world**

with:

- first-person movement
- collision
- lighting
- atmosphere
- multiplayer spawn awareness
- seed-based regeneration

That is the next major Project Nightmare milestone.


---

## 25. ASSET DATABASE STATUS — UPDATED

A real browser-persistent asset vault has now been added.

Files:

- `js/database/asset-store.js`
- `js/database/README.md`
- `js/ui/dev-lab.js`

Database:

`project-nightmare-assets`

Storage engine:

**IndexedDB**

The vault stores binary files plus structured metadata including:

- stable asset ID
- name
- type
- category
- MIME type
- size
- tags
- description
- engine path
- version
- timestamps
- binary Blob
- extensible metadata

The Dev Page now has an initial:

- asset drop/browse area
- category selection
- tags
- descriptions
- persistent ingest
- asset library
- search
- type filtering
- image/animation preview
- audio preview
- asset deletion
- vault count
- UI/background visual preview laboratory

### IMPORTANT DATABASE BOUNDARY

This is currently a **local persistent browser database**.

It survives normal reloads/restarts for that browser profile, but it is **not a cloud/shared multiplayer database**.

Do not claim uploaded assets are automatically available on another computer yet.

The asset metadata contract and stable IDs are deliberately designed so a future server-backed storage layer can be introduced without redesigning the game asset model.

### NEXT DATABASE WORK

Connect the asset IDs into:

- Sprite Matrix
- animation system
- Voice Scripting
- Virtual Sandbox
- environment materials
- UI/background system
- game runtime

The engine should request assets by stable ID rather than relying on hard-coded page-local uploads.

---

## 26. VISUAL DEVELOPMENT DIRECTION — UPDATED

The current visual layer is still an early placeholder and is **not yet at the intended AAA/cinematic browser-game target**.

The Dev Page is now being treated as the future visual production hub.

It should eventually support authoring/reusing:

- game UI
- menus
- HUDs
- title screens
- backgrounds
- environmental artwork
- sprite sheets
- animation compositions
- material/texture sets
- CRT/surveillance screens
- horror overlays
- lighting presets
- visual effects
- reusable interface components

Future uploaded artwork and animations supplied by the project team must be ingestible into the same asset vault rather than becoming isolated one-off files.

The visual target is substantially beyond retro/low-fidelity presentation. Retro digital horror can remain part of the aesthetic language, but the overall presentation should support detailed, cinematic, atmospheric 3D work.

---

## 27. IMMEDIATE BUILD PRIORITIES AFTER THIS HANDOVER

1. Upgrade the renderer from WebGL clear-screen foundation to real 3D rendering.
2. Build procedural 3D geometry from the existing room graph.
3. Build first-person camera and collision.
4. Build a proper visual material/lighting pipeline.
5. Connect the Dev asset vault to engine resources.
6. Expand the Dev Page into a visual composition/editor system.
7. Upgrade the Virtual Sandbox to show the actual generated environment.
8. Preserve Android/desktop adaptive quality.
9. Keep multiplayer architecture capped at 8 players.
10. Keep the system ready for supplied artwork and animations later.
