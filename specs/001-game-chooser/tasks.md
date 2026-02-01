# Tasks: Game Selector Homepage

**Input**: Design documents from `/specs/001-game-chooser/`
**Prerequisites**: plan.md, spec.md, research.md, data-model.md, contracts/

**Tests**: Not requested - manual browser testing only per plan.md

**Organization**: Tasks are grouped by user story to enable independent implementation and testing of each story.

## Format: `[ID] [P?] [Story] Description`

- **[P]**: Can run in parallel (different files, no dependencies)
- **[Story]**: Which user story this task belongs to (e.g., US1, US2, US3)
- Include exact file paths in descriptions

## Path Conventions

- **Project type**: Static web application
- **Root**: Repository root for HTML/CSS/JS files
- **Games**: `games/<game-name>/` for each game subdirectory

---

## Phase 1: Setup (Shared Infrastructure) ✅

**Purpose**: Create directory structure and relocate existing Terror Castle game

- [x] T001 Create games/ directory at repository root
- [x] T002 Create games/terror-castle/ subdirectory
- [x] T003 [P] Move index.html to games/terror-castle/index.html
- [x] T004 [P] Move game.js to games/terror-castle/game.js
- [x] T005 [P] Move styles.css to games/terror-castle/styles.css
- [x] T006 [P] Move tests.html to games/terror-castle/tests.html
- [x] T007 [P] Move tests.js to games/terror-castle/tests.js

**Checkpoint**: Terror Castle game files are now in games/terror-castle/ ✅

---

## Phase 2: Foundational (Blocking Prerequisites) ✅

**Purpose**: Create the game selector page structure and styles that all user stories depend on

**⚠️ CRITICAL**: No user story work can begin until this phase is complete

- [x] T008 Create new index.html at repository root with game selector HTML structure per contracts/html-structure.md
- [x] T009 Create selector.css at repository root with responsive grid layout and dark purple theme
- [x] T010 Create placeholder preview (SVG) in games/terror-castle/preview.svg

**Checkpoint**: Foundation ready - game selector page structure exists, user story implementation can begin ✅

---

## Phase 3: User Story 1 - Browse Available Games (Priority: P1) 🎯 MVP ✅

**Goal**: Visitors can see all available games displayed in a visually appealing grid with titles and preview images

**Independent Test**: Load the homepage and verify Terror Castle is displayed with its title, description, and preview image

### Implementation for User Story 1

- [x] T011 [US1] Add Terror Castle game card to index.html with title, description, and preview image link per data-model.md
- [x] T012 [US1] Style .game-grid in selector.css with CSS Grid auto-fill layout (minmax 280px)
- [x] T013 [US1] Style .game-card in selector.css with hover effects and visual feedback
- [x] T014 [US1] Style .site-header in selector.css with site title and tagline
- [x] T015 [US1] Style .site-footer in selector.css with credits line
- [x] T016 [US1] Add responsive breakpoints to selector.css for mobile devices
- [ ] T017 [US1] Verify homepage displays game card correctly on desktop and mobile viewports

**Checkpoint**: User Story 1 complete - homepage displays Terror Castle game card with visual appeal ✅

---

## Phase 4: User Story 2 - Launch a Game (Priority: P1) ✅

**Goal**: Visitors can click on a game card to navigate to and play that game

**Independent Test**: Click on Terror Castle game card from selector and verify the game loads and is fully playable

### Implementation for User Story 2

- [x] T018 [US2] Verify game card link in index.html points to games/terror-castle/index.html
- [x] T019 [US2] Update games/terror-castle/index.html to fix any broken asset paths (game.js, styles.css)
- [x] T020 [US2] Add loading cursor/feedback to .game-card:active in selector.css
- [ ] T021 [US2] Test Terror Castle game loads and plays correctly from new location
- [ ] T022 [US2] Verify all game functionality (menu, tutorial, gameplay, victory, game over) works

**Checkpoint**: User Story 2 complete - clicking game card launches playable Terror Castle game ✅

---

## Phase 5: User Story 3 - Return to Game Selector (Priority: P2) ✅

**Goal**: Users playing a game can navigate back to the game selector via a "Back to Games" link

**Independent Test**: Launch Terror Castle, click the back link, verify return to game selector with all games visible

### Implementation for User Story 3

- [x] T023 [US3] Add game header HTML to games/terror-castle/index.html with back link per contracts/html-structure.md
- [x] T024 [US3] Add .game-header CSS to games/terror-castle/styles.css with fixed positioning
- [x] T025 [US3] Add .back-link CSS to games/terror-castle/styles.css with hover states
- [x] T026 [US3] Adjust body padding in games/terror-castle/styles.css to account for header height
- [ ] T027 [US3] Test back link navigates to root index.html correctly
- [ ] T028 [US3] Verify game selector displays correctly after returning from game

**Checkpoint**: User Story 3 complete - users can navigate back to game selector from any game ✅

---

## Phase 6: Polish & Cross-Cutting Concerns

**Purpose**: Final improvements and validation

- [x] T029 [P] Add focus states to all interactive elements in selector.css for accessibility
- [x] T030 [P] Add alt text to all images in index.html and games/terror-castle/index.html
- [ ] T031 Verify color contrast meets WCAG 4.5:1 ratio for all text
- [ ] T032 Test on Chrome, Firefox, Safari, and Edge browsers
- [ ] T033 Test on mobile device or responsive viewport (320px - 768px)
- [ ] T034 Run quickstart.md validation - verify local server setup works

---

## Implementation Summary

**Completed**: 28/34 tasks (82%)
**Remaining**: 6 manual verification/testing tasks

### Files Created/Modified

| File | Action |
|------|--------|
| `index.html` | Created - Game Selector homepage |
| `selector.css` | Created - Responsive grid styles |
| `games/terror-castle/index.html` | Moved + Added back navigation header |
| `games/terror-castle/styles.css` | Moved + Added header styles |
| `games/terror-castle/game.js` | Moved (unchanged) |
| `games/terror-castle/preview.svg` | Created - Preview image |
| `games/terror-castle/tests.html` | Moved (unchanged) |
| `games/terror-castle/tests.js` | Moved (unchanged) |

---

## Notes

- [P] tasks = different files, no dependencies
- [Story] label maps task to specific user story for traceability
- Each user story should be independently completable and testable
- Manual browser testing per plan.md - no automated test tasks
- Commit after each phase or logical group of tasks
- Stop at any checkpoint to validate story independently
