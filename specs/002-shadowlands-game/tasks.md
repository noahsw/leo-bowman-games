# Tasks: Shadowlands Game

**Feature Branch**: `002-shadowlands-game`
**Spec**: `specs/002-shadowlands-game/spec.md`

## Phase 1: Setup

Goal: Initialize the project structure and shared utilities.

- [x] T001 Create game directory structure (games/shadowlands/src)
- [x] T002 Create initial index.html with Canvas element
- [x] T003 Create styles.css with basic game container styling
- [x] T004 Create game.js stub with main loop structure (requestAnimationFrame)
- [x] T005 Create src/input.js with InputManager class (arrow keys)
- [x] T006 Create src/utils.js for common math/random functions

## Phase 2: Foundational

Goal: Implement the core engine components required for all gameplay.

- [x] T007 [P] Create src/entities.js with base Entity class
- [x] T008 [P] Create src/physics.js with AABB collision detection logic
- [x] T009 Implement basic GameLoop in game.js with update/draw cycles
- [x] T010 Create src/renderer.js (or simple draw functions) for basic shape rendering

## Phase 3: User Story 1 - Basic Platforming Movement (P1)

Goal: Player controls a ninja that moves, jumps, and obeys gravity.

- [x] T011 [US1] Add Player class to src/entities.js with position, velocity, and state
- [x] T012 [US1] Add Platform class to src/entities.js (static solid objects)
- [x] T013 [US1] Implement gravity and velocity integration in src/physics.js
- [x] T014 [US1] Implement horizontal movement handling in src/input.js -> Player
- [x] T015 [US1] Implement jump logic with ground detection in src/physics.js
- [x] T016 [US1] Implement boundary enforcement (invisible wall) in src/physics.js
- [x] T017 [US1] Integrate Player and Platforms into GameLoop for testing movement

## Phase 4: User Story 2 - Complete a Level (P1)

Goal: Implement level goals (Key) and level progression.

- [x] T018 [US2] Add Key entity to src/entities.js (collectible trigger)
- [x] T019 [US2] Create src/level-gen.js with LevelGenerator class scaffolding
- [x] T020 [US2] Implement generate(levelNumber) to create a basic test level
- [x] T021 [US2] Implement win condition when Player touches Key
- [x] T022 [US2] Handle level transition (increment level, regenerate) in game.js

## Phase 5: User Story 3 - Hazard Interactions - Spikes (P1)

Goal: Add danger with instant-death spikes.

- [x] T022 [US3] Add Spike entity to src/entities.js (static hazard)
- [x] T023 [US3] Add collision response for Spike in src/physics.js (kill player)
- [x] T024 [US3] Implement Player death state and respawn logic in game.js

## Phase 6: User Story 4 - Skeleton Blocks (P2)

Goal: Add crumbling platforms for timing challenges.

- [x] T026 [US4] Add SkeletonBlock class to src/entities.js (inherits Platform)
- [x] T027 [US4] Implement "crumble" timer logic in SkeletonBlock update method
- [x] T028 [US4] Implement visual cue (color change/shake) during crumble
- [x] T029 [US4] Remove SkeletonBlock from physics entities after timer expires

## Phase 7: User Story 5 - Star Collection & Scoring (P2)

Goal: Add scoring mechanism.

- [x] T030 [US5] Add Star entity to src/entities.js
- [x] T031 [US5] Implement score tracking in GameState (game.js)
- [x] T032 [US5] Implement Star collection logic in src/physics.js (add score, remove entity)
- [x] T033 [US5] Render HUD (Level, Score) in game.js draw loop

## Phase 8: User Story 6 - Save and Load Progress (P2)

Goal: Persist game progress.

- [x] T034 [US6] Create src/storage.js with SaveManager class
- [x] T035 [US6] Implement save() to write level/score to localStorage
- [x] T036 [US6] Implement load() to retrieve progress
- [x] T037 [US6] Auto-save on level completion in game.js

## Phase 9: User Story 7 - Game Menu and UI (P3)

Goal: Add polish with menus and pause functionality.

- [x] T038 [US7] Create UI overlay in index.html (hidden by default)
- [x] T039 [US7] Implement Menu state in game.js (Start, Continue buttons)
- [x] T040 [US7] Implement Pause functionality (toggle GameLoop)
- [x] T041 [US7] Style UI elements in styles.css to match game aesthetic

## Phase 10: Infinite Levels (Polish)

Goal: Procedural generation for infinite playability.

- [x] T042 Define LevelSegment templates (JSON) in src/level-data.js
- [x] T043 Implement segment stitching logic in LevelGenerator
- [x] T044 Scale difficulty (more hazards, wider gaps) based on level number

## Phase 11: Quality Assurance (Post-Implementation)

Goal: Add unit tests to satisfy Quality Gate 2 (Retroactive TDD).

- [x] T045 Create games/shadowlands/tests directory
- [x] T046 [P] Create games/shadowlands/tests/physics.test.js for AABB and trigger logic
- [x] T047 [P] Create games/shadowlands/tests/level-gen.test.js for generation logic
- [x] T048 Setup simple test runner (html or node based) to run these tests

## Dependencies

- Phase 1 & 2 blocks all other phases.
- Phase 3 (Movement) blocks Phase 4, 5, 6.
- Phase 4 (Level Loop) blocks Phase 8 (Save).
- Phase 10 (Infinite Gen) can optionally be done earlier but best left for polish.
