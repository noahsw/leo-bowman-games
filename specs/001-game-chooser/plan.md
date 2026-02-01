# Implementation Plan: Game Selector Homepage

**Branch**: `001-game-chooser` | **Date**: 2026-02-01 | **Spec**: [spec.md](spec.md)
**Input**: Feature specification from `/specs/001-game-chooser/spec.md`

## Summary

Transform the current single-game site into a multi-game portal by converting index.html into a game selector homepage that displays available games in a responsive grid layout. The existing Terror Castle game will be relocated to `games/terror-castle/` while the new homepage provides navigation to all games with preview images, titles, and a "Back to Games" link within each game.

## Technical Context

**Language/Version**: HTML5, CSS3, JavaScript (ES6+)
**Primary Dependencies**: None (vanilla HTML/CSS/JS, no frameworks)
**Storage**: N/A (static files only)
**Testing**: Manual browser testing (desktop + mobile)
**Target Platform**: Modern web browsers (Chrome, Firefox, Safari, Edge)
**Project Type**: Static web application
**Performance Goals**: Page load under 2 seconds, instant navigation
**Constraints**: No build tools, no server-side processing, mobile responsive
**Scale/Scope**: 1-6 games initially, expandable

## Constitution Check

*GATE: Must pass before Phase 0 research. Re-check after Phase 1 design.*

The constitution template is not yet configured for this project. No blocking gates detected. Proceeding with standard web development best practices:

- [x] Static files only (no server required)
- [x] Vanilla HTML/CSS/JS (no unnecessary dependencies)
- [x] Mobile-first responsive design
- [x] Semantic HTML structure
- [x] Accessible navigation

## Project Structure

### Documentation (this feature)

```text
specs/001-game-chooser/
├── plan.md              # This file
├── research.md          # Phase 0 output
├── data-model.md        # Phase 1 output
├── quickstart.md        # Phase 1 output
└── tasks.md             # Phase 2 output (/speckit.tasks command)
```

### Source Code (repository root)

```text
# Current structure (before)
index.html           # Terror Castle game entry
game.js              # Terror Castle game logic
styles.css           # Terror Castle styles
tests.html           # Terror Castle tests
tests.js             # Terror Castle test scripts

# New structure (after)
index.html           # Game Selector homepage (NEW)
selector.css         # Game Selector styles (NEW)
games/
└── terror-castle/
    ├── index.html   # Terror Castle game (MOVED)
    ├── game.js      # Terror Castle game logic (MOVED)
    ├── styles.css   # Terror Castle styles (MOVED)
    ├── preview.png  # Game preview image (NEW)
    ├── tests.html   # Terror Castle tests (MOVED)
    └── tests.js     # Terror Castle test scripts (MOVED)
```

**Structure Decision**: Flat static site with games organized in subdirectories. Each game is self-contained with its own assets and entry point. The root index.html serves as the game selector.

## Complexity Tracking

No violations requiring justification. This is a straightforward static site restructure.
