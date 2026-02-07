<!--
Sync Impact Report:
- Version change: 0.0.0 (Template) → 1.0.0 (Initial Ratification)
- Modified Principles: All placeholders replaced with concrete game dev principles.
- Added Sections: Test-Driven Development (Mandated), Component Modularity, Vanilla Implementation.
- Templates requiring updates:
  - .specify/templates/plan-template.md (✅ Pending runtime check)
  - .specify/templates/spec-template.md (✅ Pending runtime check)
- TODO: None
-->

# leo-bowman-games Constitution

## Core Principles

### I. Test-Driven Development (NON-NEGOTIABLE)
All implementation MUST follow strict Test-Driven Development. No implementation code shall be written before:
1. Unit tests are written
2. Tests are validated and approved by the user
3. Tests are confirmed to FAIL (Red phase)

### II. Component Modularity
Each game must exist as a self-contained module within the `games/` directory. Shared logic (physics, audio, inputs) should be extracted to `games/shared/` only when used by multiple games. Games should be independently testable and playable.

### III. Vanilla Implementation
Prefer standard Web APIs (HTML5 Canvas, Web Audio, ES Modules) over external frameworks or libraries unless complexity demands it. This ensures longevity, performance, and educational value.

### IV. Documentation First
No code is written without a specification and implementation plan. Design decisions, data models, and trade-offs must be documented in the `specs/` directory before implementation begins.

### V. Simplicity
Avoid over-engineering. Solicit the simplest solution that meets the requirements. Complex patterns (e.g., Entity-Component-Systems) should only be introduced if the game logic scale requires it.

## Technical Constraints

- **Stack**: HTML5, CSS3, JavaScript (ES6+).
- **Environment**: Modern web browsers (Chrome, Firefox, Safari).
- **No Build Step**: Code should run directly in the browser via a local server (e.g., `npx serve`) without transpilation, unless a specific feature plan justifies introducing a bundler.
- **Assets**: Assets should be contained within the game's directory or a shared asset folder.

## Quality Gates

1. **Linting**: All code must pass `npm run lint` (if configured) or standard style checks.
2. **Test Coverage**: Logic-heavy components (Physics, State Managers) must have unit tests.
3. **Manual Verification**: Gameplay loops must be manually verified against the User Scenarios in the spec.
4. **TDD Compliance**: Every PR/Feature must demonstrate the Red-Green-Refactor cycle.

## Governance

This Constitution supersedes all other project practices. Amendments require documentation, approval, and a migration plan for existing code if necessary.

**Version**: 1.0.0 | **Ratified**: 2026-02-01 | **Last Amended**: 2026-02-01