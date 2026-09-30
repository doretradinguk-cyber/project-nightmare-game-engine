# Project Nightmare — Camera Direction Specification

## Status

**LOCKED DESIGN SYSTEM**

This specification defines the camera language for Project Nightmare's exploration, environmental storytelling and nightmare sequences.

> **Normal world = stable camera language. Nightmare = camera language becomes part of the horror.**

The camera must never create friction merely because the engine is doing something complicated.

## Core Cinematography Law

**Normality creates the horror.**

Normal exploration uses predictable, readable camera behaviour. Cinematic control may intervene only when it improves storytelling, discovery or atmosphere. During an actual nightmare, camera behaviour may deliberately become unreliable.

**Controls are sacred until the nightmare begins.**

## Camera Inventory

| Camera | Position / Relationship | Lens | Shot | Movement |
|---|---|---:|---|---|
| Cam A — Lobby Establishing | Rear/elevated lobby position, ~3.2m | 20mm | Extreme wide | Slow automated dolly |
| Cam B — Player Follow | ~4m behind player, ~1.8m high | 28mm | Wide / over-shoulder | Smooth follow |
| Cam C — Corridor Forward | Corridor entrance, ~1.7m | 24mm | Wide | Slow forward dolly |
| Cam D — Corridor Rear | Opposite corridor end | 35mm | Medium | Static / subtle drift |
| Cam E — Room Discovery | Inside doorway, ~1.5m offset | 28mm | Medium-wide | Slow orbit |
| Cam F — Evidence | 0.5–1.5m from clue | 50mm | Close-up | Static / micro push-in |
| Cam G — Stairwell Vertical | Lower landing, ~1.6m | 18mm | Wide | Tilt / slow orbit |
| Cam H — Overlook | Upper landing, ~3.5m | 24mm | High wide | Slow crane |
| Cam I — Sentinel Eye | Facing sentinel, ~2.3m | 70mm | Close-up | Static / tiny push-in |
| Cam J — Nightmare | Adaptive position from current geometry | 16–35mm | Wide → close | Unstable orbit / dolly |
| Cam K — Trap Reveal | Offset from mechanism, ~1.5m | 35mm | Medium | Short lateral dolly |
| Cam L — Escape / Exit | Behind or beside final doorway | 24mm | Wide | Reverse dolly |

## Controller / Operator Mapping

| Input | Normal Operation | Cinematic Override |
|---|---|---|
| W | Forward | Disabled during locked cinematic |
| S | Backward | Disabled during locked cinematic |
| A / D | Strafe / orbit | Controlled orbit |
| Mouse X | Horizontal pan | Reduced sensitivity |
| Mouse Y | Vertical tilt | Tightened pitch limits |
| Shift | Sprint / rapid dolly | Increased dolly only when explicitly permitted |
| Left Click | Enter / reacquire control | Interaction or camera lock |
| Esc | Release pointer lock | Always available |
| 1–9 / function keys | Optional camera selection | Dev/operator mode only |
| Space | Optional crane control in Dev Lab | Never normal gameplay |

## Spatial Coverage

### Lobby
Cam A establishes the complete lobby. Cam B then becomes the player-facing camera. The hand-off should preserve spatial orientation.

### Corridors
Cam C establishes the direction of travel while Cam D covers the rear/alternate direction. These cameras must not reveal information the player could not logically perceive unless the reveal is deliberately part of the horror.

### Rooms
Cam E frames room discovery. Cam F isolates important evidence, clues and environmental details without turning ordinary exploration into forced cinematics.

### Vertical Spaces
Cam G establishes the staircase from below. Cam H establishes the destination from above. Together they preserve vertical continuity.

### Sentinel Encounters
Cam I is reserved for deliberate eye-contact moments. The shot should hold long enough for the player to realise that the eye is watching them.

### Nightmare
Cam J is the controlled break from normal camera language. Distortion may include perspective changes, impossible movement, unstable orbiting or spatial displacement, but these effects must be intentional.

### Traps
Cam K reveals mechanisms or consequences without obscuring the player's understanding of the event.

### Escape
Cam L creates a readable retreat before handing control back to normal exploration.

## Chronological Camera Flow

1. **Initialisation:** Cam A establishes the mansion lobby.
2. **Player control:** Transition to Cam B.
3. **Corridor entry:** Cam C establishes depth and direction.
4. **Blind-spot coverage:** Cam D observes the alternate/rear direction.
5. **Room discovery:** Cam E frames the new space.
6. **Investigation:** Cam F provides focused environmental detail.
7. **Vertical transition:** Cam G → Cam H preserves staircase continuity.
8. **Sentinel encounter:** Cam I holds the eye-contact moment.
9. **Nightmare threshold:** Cam J takes over only when reality actually begins to fail.
10. **Trap reveal:** Cam K provides a short controlled reveal.
11. **Escape:** Cam L retreats with the player.
12. **Return:** Cinematic control is released immediately and normal gameplay resumes.

## Flow Over Friction

Camera systems must never make the player feel that they are:

- Waiting for the engine
- Fighting the camera
- Fighting controls
- Configuring the game
- Waiting for a cinematic to finish

The desired thought is:

> **“Why is this happening?”**

Not:

> **“Why isn't this working?”**

## Project Nightmare Cinematography Principle

**STABLE → UNEASY → DISTORTED → IMPOSSIBLE → NIGHTMARE**

The camera follows the same escalation model as the world.

Outside the nightmare, it is a reliable observer.

Inside the nightmare, it can become part of the threat.

---

**Project Nightmare — Camera Direction Specification**  
**Dore Trading UK**
