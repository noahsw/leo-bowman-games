# Feature Specification: Shadowlands Game

**Feature Branch**: `002-shadowlands-game`
**Created**: 2026-02-01
**Status**: Draft
**Input**: User description: "Create a new game called Shadowlands - a 2D platformer with ninja character, spikes, skeleton blocks, stars, keys, and infinite procedurally increasing difficulty levels with save functionality"

## User Scenarios & Testing *(mandatory)*

### User Story 1 - Basic Platforming Movement (Priority: P1)

A player launches Shadowlands and controls a black ninja character in a 2D side-scrolling world. They use arrow keys to move left/right and jump. The ninja responds smoothly to input with proper gravity physics. The player navigates across platforms, avoiding pits.

**Why this priority**: Core movement is the foundation of any platformer. Without responsive controls, no other gameplay element matters. This must work before anything else.

**Independent Test**: Can be fully tested by launching the game and verifying the ninja moves left/right with arrow keys, jumps with up arrow, and falls with gravity.

**Acceptance Scenarios**:

1. **Given** the game is loaded, **When** the player presses the left arrow key, **Then** the ninja moves left across the screen
2. **Given** the game is loaded, **When** the player presses the right arrow key, **Then** the ninja moves right across the screen
3. **Given** the ninja is on a platform, **When** the player presses the up arrow key, **Then** the ninja jumps upward and falls back down with gravity
4. **Given** the ninja is in the air, **When** the player presses jump again, **Then** nothing happens (no double jump)
5. **Given** the ninja walks off a platform edge, **When** there is no ground below, **Then** the ninja falls until landing on a lower platform or dying in a pit

---

### User Story 2 - Complete a Level (Priority: P1)

A player navigates through Level 1, avoiding hazards and collecting the green key at the end. Upon collecting the key, the level completes and the player advances to the next level. The player sees their current level number displayed.

**Why this priority**: The core game loop of completing levels is essential. This gives the game purpose and enables the infinite level progression.

**Independent Test**: Can be fully tested by playing Level 1, reaching the green key, and verifying transition to Level 2.

**Acceptance Scenarios**:

1. **Given** the player is on Level 1, **When** the ninja touches the green key, **Then** a level complete message displays
2. **Given** the level is complete, **When** the transition finishes, **Then** Level 2 loads with increased difficulty
3. **Given** any level, **When** the player looks at the screen, **Then** the current level number is visible in the UI
4. **Given** the player completes Level N, **When** the next level loads, **Then** Level N+1 is harder (more hazards, longer, trickier jumps)

---

### User Story 3 - Hazard Interactions - Spikes (Priority: P1)

A player encounters spike hazards placed throughout levels. If the ninja touches spikes, the ninja dies instantly. The player respawns at the start of the current level and can try again.

**Why this priority**: Hazards create challenge and stakes. Spikes are the simplest instant-death hazard and fundamental to platformer difficulty.

**Independent Test**: Can be fully tested by walking the ninja into spikes and verifying death and respawn.

**Acceptance Scenarios**:

1. **Given** the ninja is moving, **When** the ninja touches spikes, **Then** the ninja dies with a death animation
2. **Given** the ninja has died, **When** the death animation completes, **Then** the ninja respawns at the level start
3. **Given** the ninja respawns, **When** gameplay resumes, **Then** all level elements reset to initial state (key position, star collection, skeleton blocks)

---

### User Story 4 - Hazard Interactions - Skeleton Blocks (Priority: P2)

A player encounters skeleton blocks (bone-colored platforms) that span gaps or pits. When the ninja lands on a skeleton block, it begins crumbling and disappears after 2 seconds. If the ninja is still on the block when it disappears, they fall into the pit below and die.

**Why this priority**: Skeleton blocks add timing-based challenge and create tense moments. They're a signature mechanic that differentiates Shadowlands.

**Independent Test**: Can be fully tested by jumping onto a skeleton block, waiting, and observing the 2-second timer and collapse.

**Acceptance Scenarios**:

1. **Given** the ninja is approaching a skeleton block, **When** the ninja lands on it, **Then** a 2-second countdown begins with visual feedback (crumbling animation)
2. **Given** a skeleton block is crumbling, **When** 2 seconds elapse, **Then** the block disappears
3. **Given** the ninja is on a skeleton block, **When** the block disappears, **Then** the ninja falls into the pit below and dies
4. **Given** the ninja jumped off the skeleton block, **When** the block disappears, **Then** the ninja survives (if they landed safely elsewhere)
5. **Given** the level restarts, **When** the ninja respawns, **Then** all skeleton blocks are restored to solid state

---

### User Story 5 - Star Collection and Scoring (Priority: P2)

A player sees collectible stars scattered throughout levels. Collecting stars increases the player's score. The current score is displayed on screen. Stars are optional but reward exploration and skill.

**Why this priority**: Scoring adds replay value and rewards skilled play. It's important for engagement but not critical for the core loop.

**Independent Test**: Can be fully tested by collecting a star and verifying score increases on the display.

**Acceptance Scenarios**:

1. **Given** a star is visible in the level, **When** the ninja touches the star, **Then** the star disappears and score increases
2. **Given** the player collects multiple stars, **When** viewing the score, **Then** the score reflects all collected stars
3. **Given** the player dies and respawns, **When** the level resets, **Then** previously collected stars reappear and score for that attempt resets
4. **Given** the player completes a level, **When** moving to the next level, **Then** the score carries forward (cumulative across all levels)

---

### User Story 6 - Save and Load Progress (Priority: P2)

A player can save their current level progress so they can resume later. When returning to the game, they can continue from their saved level. This persists across browser sessions.

**Why this priority**: Save functionality enables long-term engagement. Without it, players must restart from Level 1 every session, which becomes frustrating at higher levels.

**Independent Test**: Can be fully tested by reaching Level 5, closing the game, reopening it, and verifying the option to continue from Level 5.

**Acceptance Scenarios**:

1. **Given** the player completes a level, **When** the next level starts, **Then** progress is automatically saved
2. **Given** the player closes the game, **When** they reopen it later, **Then** they see options to "Continue" or "New Game"
3. **Given** the player selects "Continue", **When** the game loads, **Then** they start at their saved level with their saved score
4. **Given** the player selects "New Game", **When** the game starts, **Then** they begin at Level 1 with zero score

---

### User Story 7 - Game Menu and UI (Priority: P3)

A player sees a main menu when launching the game with the title "Shadowlands" and options to start playing. During gameplay, they see their current level, score, and can pause the game.

**Why this priority**: Polish and usability. A proper menu creates a professional feel, but the game can function without it initially.

**Independent Test**: Can be fully tested by launching the game and interacting with menu options.

**Acceptance Scenarios**:

1. **Given** the game launches, **When** the main menu displays, **Then** the player sees "Shadowlands" title and "Play" / "Continue" buttons
2. **Given** the player is in a level, **When** they press Escape or P, **Then** the game pauses with a pause menu
3. **Given** the game is paused, **When** the player selects "Resume", **Then** gameplay continues
4. **Given** the game is paused, **When** the player selects "Quit to Menu", **Then** they return to the main menu

---

### Edge Cases

- What happens if the player falls into a pit (no platform below)? The ninja dies and respawns at level start.
- What happens if the player is mid-jump when a skeleton block disappears? They continue their jump arc and land wherever physics takes them.
- What happens if saved data is corrupted or missing? Treat as new player, start at Level 1.
- What happens at extremely high levels (100+)? Difficulty caps at a maximum to remain playable but challenging.
- What happens if the player tries to move beyond the left edge of Level 1? Invisible wall prevents moving off-screen left.
- What happens if the green key is on a skeleton block? The player must time their collection before the block collapses.

## Requirements *(mandatory)*

### Functional Requirements

- **FR-001**: Game MUST render a 2D side-scrolling level with platforms, hazards, and collectibles
- **FR-002**: Player MUST control a black ninja character using arrow keys (left, right, up for jump)
- **FR-003**: Ninja MUST have gravity physics (falls when not on solid ground)
- **FR-004**: Ninja MUST NOT be able to double-jump (only jump when grounded)
- **FR-005**: Spikes MUST kill the ninja instantly on contact
- **FR-006**: Skeleton blocks MUST support the ninja when landed on
- **FR-007**: Skeleton blocks MUST begin crumbling visually when the ninja lands on them
- **FR-008**: Skeleton blocks MUST disappear exactly 2 seconds after the ninja first lands on them
- **FR-009**: Falling into a pit (below screen) MUST kill the ninja
- **FR-010**: Death MUST respawn the ninja at the level start with level elements reset
- **FR-011**: Stars MUST be collectible by touching them
- **FR-012**: Collecting a star MUST increase the displayed score
- **FR-013**: Green key MUST be placed at the end of each level
- **FR-014**: Touching the green key MUST complete the level
- **FR-015**: Completing a level MUST advance the player to the next level
- **FR-016**: Each subsequent level MUST be more difficult than the previous
- **FR-017**: Game MUST support infinite levels with procedural difficulty increase
- **FR-018**: Game MUST save the player's highest reached level locally
- **FR-019**: Game MUST offer "Continue" option if saved progress exists
- **FR-020**: Game MUST display current level number during gameplay
- **FR-021**: Game MUST display current score during gameplay
- **FR-022**: Game MUST work on desktop browsers with keyboard input

### Key Entities

- **Ninja**: The player character. Black ninja appearance. Has position, velocity, alive/dead state, grounded state.
- **Level**: A playable stage. Contains platforms, hazards, stars, and one green key. Has level number and difficulty parameters.
- **Platform**: Solid ground the ninja can stand on. Normal platforms are permanent.
- **Skeleton Block**: A special platform that crumbles 2 seconds after the ninja lands on it. Has crumbling state and timer.
- **Spike**: Instant-death hazard. Static position in level.
- **Star**: Collectible that increases score. Disappears when collected.
- **Green Key**: Level exit. Touching it completes the level.
- **Save Data**: Persisted player progress. Contains highest level reached and optionally high score.

## Success Criteria *(mandatory)*

### Measurable Outcomes

- **SC-001**: Players can complete Level 1 within 60 seconds on first attempt (level is learnable)
- **SC-002**: Ninja responds to input within 100 milliseconds (feels responsive)
- **SC-003**: Game maintains smooth 60 FPS gameplay on standard hardware
- **SC-004**: Players can reach Level 10+ in a single session if skilled (progression works)
- **SC-005**: Saved progress correctly restores 100% of the time when returning to game
- **SC-006**: 90% of playtesters understand controls without instructions (intuitive design)
- **SC-007**: Skeleton block timing is consistent (exactly 2 seconds every time)
- **SC-008**: Level difficulty increases noticeably but fairly (each level slightly harder than previous)

## Assumptions

- The game will be a browser-based game similar to Terror Castle (HTML5 Canvas)
- Levels are procedurally generated based on level number (not hand-designed)
- Save data uses browser local storage (no server/account required)
- The game is single-player only
- No sound effects or music in initial version (can be added later)
- Screen size is similar to Terror Castle (900x600 or responsive)
- Stars give a fixed point value (e.g., 100 points each)
- The ninja has a single life per level attempt (no health bar)
- Difficulty increase includes: more spikes, more skeleton blocks, longer levels, trickier jumps
- Maximum difficulty caps at a reasonable level to prevent impossible levels
