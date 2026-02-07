# Data Model: Shadowlands

## Entities

### GameState
Runtime state of the active session.

| Field | Type | Description |
|-------|------|-------------|
| `level` | Number | Current level number (starts at 1) |
| `score` | Number | Current session score |
| `state` | Enum | MENU, PLAYING, PAUSED, GAME_OVER, LEVEL_TRANSITION |
| `player` | Player | The ninja entity |
| `entities` | Array | List of platforms, hazards, collectibles |
| `camera` | Object | { x, y } offset for scrolling |

### SaveData
Persisted progress (localStorage key: `shadowlands_save`).

| Field | Type | Description |
|-------|------|-------------|
| `maxLevel` | Number | Highest level reached |
| `highScore` | Number | All-time high score |

### LevelSegment
Template for procedural generation.

| Field | Type | Description |
|-------|------|-------------|
| `difficulty` | Number | 1-10 scale rating |
| `width` | Number | Width of segment in grid units |
| `layout` | Array | List of relative entity positions |

## Physics & Collision

### Entity Types
- **Player**: Dynamic, affected by gravity, user controlled.
- **Platform**: Static, solid.
- **SkeletonBlock**: Static initially, becomes non-solid/removed after timer.
- **Spike**: Static, trigger (onCollide -> kill).
- **Collectable**: Static, trigger (onCollide -> collect).
