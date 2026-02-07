# Research: Shadowlands Game

## Unknowns & Clarifications

### 1. Procedural Generation Strategy
**Decision**: Segment-based Generation.
**Rationale**:
- **Playability**: Pure random placement often leads to impossible jumps or boring flat areas.
- **Difficulty Control**: We can design "Easy", "Medium", and "Hard" segments (chunks of platforms/hazards) and mix them based on the current level number.
- **Implementation**: A library of pre-defined JSON/Object segments that are stitched together.
**Alternatives Considered**:
- **Pure Random**: Too risky for "impossible levels".
- **Perlin Noise**: Good for terrain, bad for precise platforming.

### 2. Physics Engine
**Decision**: Custom AABB (Axis-Aligned Bounding Box) Physics.
**Rationale**:
- **Simplicity**: We only need gravity, velocity, and rectangular collision.
- **Control**: "Terror Castle" likely uses similar logic. Full engines like Matter.js are overkill and add bloat.
- **Performance**: Extremely lightweight (SC-003).

### 3. Save System
**Decision**: `localStorage` with a simple JSON schema.
**Rationale**:
- **Requirements**: "Persists across browser sessions" (User Story 6).
- **Constraint**: No backend server.

### 4. Game Loop & Rendering
**Decision**: `requestAnimationFrame` with HTML5 Canvas.
**Rationale**:
- **Standard**: The industry standard for web games.
- **Performance**: Efficient 2D rendering.
