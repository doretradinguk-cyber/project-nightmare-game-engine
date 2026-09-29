# Mansion Sandbox

The first playable environment target for Project Nightmare.

## Build order

1. WebGL renderer foundation
2. First-person camera
3. Foyer blockout
4. East Hall and Study
5. Service Stairs and Lower Level
6. Security Room
7. Lighting and power system
8. Surveillance cameras
9. Adaptive architecture events
10. Jester manifestation events

The environment data is deliberately separated from rendering so the same Mansion definition can be loaded by the Virtual Sandbox and the eventual game runtime.


## Procedural multiplayer layout

The Mansion now uses a seed-driven modular layout foundation rather than a fixed sequence of square rooms. Runs can assemble a central hub, multiple wings, corridors, side rooms, galleries, studies, staircases, loops and destination areas. Up to eight players can be supported depending on mode.

The same graph architecture is intended to support future Carnival Nightmare events such as twisting corridors, crushing walls and altered connections.
