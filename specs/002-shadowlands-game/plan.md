# Implementation Plan: Shadowlands Game

**Branch**: `002-shadowlands-game` | **Date**: 2026-02-01 | **Spec**: `specs/002-shadowlands-game/spec.md`
**Input**: Feature specification from `specs/002-shadowlands-game/spec.md`

## Summary

Implement "Shadowlands", a 2D infinite platformer with procedural level generation. The game features a ninja character, gravity physics, hazards (spikes, skeleton blocks), and collectibles (keys, stars). It uses a custom AABB physics engine and segment-based level generation logic. Progress is saved via `localStorage`.

## Technical Context

**Language/Version**: HTML5, CSS3, JavaScript (ES6+)
**Primary Dependencies**: None (Vanilla Canvas API)
**Storage**: localStorage (for save data)
**Testing**: Manual verification (per SC-006)
**Target Platform**: Desktop Web Browser (Chrome/Firefox/Safari)
**Project Type**: Web Game
**Performance Goals**: 60 FPS, <100ms input latency
**Constraints**: No external assets (use procedural/drawn graphics or placeholders), single-player
**Scale/Scope**: ~1000 LOC, Infinite levels

## Constitution Check

*GATE: Must pass before Phase 0 research. Re-check after Phase 1 design.*

- **Library-First**: N/A (Game logic is specific, but "Segment" logic is modular).
- **Test-First**: Manual testing plan defined in Spec. Automated unit tests possible for physics/generation logic but not mandated for UI/Canvas by project norms (based on Terror Castle).

## Project Structure

### Documentation (this feature)

```text
specs/002-shadowlands-game/
├── plan.md              # This file
├── research.md          # Phase 0 output
├── data-model.md        # Phase 1 output
├── quickstart.md        # Phase 1 output
├── contracts/           # Phase 1 output
│   └── api.md
└── tasks.md             # Phase 2 output
```

### Source Code (repository root)

```text
games/
└── shadowlands/
    ├── index.html       # Entry point
    ├── styles.css       # UI styling
    ├── game.js          # Main entry, GameLoop
    └── src/
        ├── physics.js   # PhysicsEngine
        ├── entities.js  # Player, Platform, Hazard classes
        ├── level-gen.js # LevelGenerator, Segments
        ├── level-data.js # Segment definitions/templates
        ├── input.js     # Input handling
        ├── renderer.js  # Drawing/Rendering logic
        ├── storage.js   # SaveManager/LocalStorage
        └── utils.js     # Shared utilities
    └── tests/
        ├── physics.test.js  # Unit tests for PhysicsEngine
        └── level-gen.test.js # Unit tests for LevelGenerator
```

**Structure Decision**: Modularized source code within `games/shadowlands/src/` to keep `game.js` clean, unlike the monolithic `terror-castle/game.js`.

## Complexity Tracking

> **Fill ONLY if Constitution Check has violations that must be justified**

| Violation | Why Needed | Simpler Alternative Rejected Because |
|-----------|------------|-------------------------------------|
| None | N/A | N/A |