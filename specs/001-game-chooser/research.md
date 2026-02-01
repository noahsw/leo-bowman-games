# Research: Game Selector Homepage

**Feature**: 001-game-chooser
**Date**: 2026-02-01

## Overview

This document captures research findings for implementing the game selector homepage feature.

## Technical Decisions

### 1. Navigation Architecture

**Decision**: Separate HTML pages with standard link navigation

**Rationale**:
- Simplest approach for static sites
- Works without JavaScript (progressive enhancement)
- Browser back/forward buttons work naturally
- Each game page is bookmarkable
- No state management complexity

**Alternatives Considered**:
- Single Page Application (SPA) with JavaScript routing - rejected as over-engineered for static content
- iframe embedding - rejected due to responsive design challenges and navigation complexity

### 2. Game Registry/Catalog

**Decision**: Hardcode game list in HTML

**Rationale**:
- Only 1-6 games expected
- No build tools in project
- Simple to maintain manually
- No JavaScript required for basic display

**Alternatives Considered**:
- JSON file with JavaScript rendering - adds complexity, requires JS for basic content
- Server-side templating - not available (static hosting)

### 3. Preview Images

**Decision**: Each game provides its own `preview.png` in its directory

**Rationale**:
- Keeps game assets self-contained
- Easy to update per-game
- Standard naming convention simplifies maintenance

**Format Recommendations**:
- Dimensions: 400x300px (4:3 aspect ratio)
- Format: PNG or WebP
- File size: Under 100KB for fast loading

### 4. Responsive Grid Layout

**Decision**: CSS Grid with auto-fill for responsive behavior

**Rationale**:
- Native browser support (no framework needed)
- Automatically adjusts columns based on viewport
- Works well with 1-6 items
- Simple CSS, easy to maintain

**Implementation**:
```css
.game-grid {
    display: grid;
    grid-template-columns: repeat(auto-fill, minmax(280px, 1fr));
    gap: 2rem;
}
```

### 5. "Back to Games" Navigation

**Decision**: Fixed header with home link on each game page

**Rationale**:
- Always visible, easy to find
- Consistent across all games
- Doesn't interfere with game canvas
- Simple HTML/CSS implementation

**Implementation**:
- Add a small header bar above the game container
- Style to match game aesthetic (dark theme)
- Include site branding and back link

### 6. Visual Theme

**Decision**: Match Terror Castle's dark purple theme

**Rationale**:
- Consistent branding across the site
- Existing color palette works well for games
- Already tested for visibility/accessibility

**Color Palette** (from existing styles):
- Background: `#0a0a1a` (dark navy)
- Primary accent: `#9400D3` (dark violet)
- Secondary: `#FFD700` (gold)
- Text: `#ffffff` (white)

## File Structure Best Practices

### Game Directory Convention

Each game should follow this structure:
```
games/<game-name>/
├── index.html      # Game entry point
├── game.js         # Game logic (if JS-based)
├── styles.css      # Game-specific styles
├── preview.png     # 400x300 preview image
└── [other assets]  # Sounds, sprites, etc.
```

### Adding New Games

To add a new game:
1. Create directory under `games/`
2. Add game files following the convention above
3. Create a 400x300px preview image
4. Add game card to `index.html` game grid

## Browser Compatibility

Target browsers (all support CSS Grid and ES6):
- Chrome 57+ (March 2017)
- Firefox 52+ (March 2017)
- Safari 10.1+ (March 2017)
- Edge 16+ (October 2017)

No polyfills required for the feature set.

## Performance Considerations

- Lazy load game preview images with `loading="lazy"`
- Optimize preview images (compress, proper dimensions)
- Minimal CSS (no framework overhead)
- No JavaScript required for selector page (progressive enhancement)

## Accessibility

- Semantic HTML (`<nav>`, `<main>`, `<article>`)
- Alt text for preview images
- Keyboard navigable (standard links)
- Focus indicators for game cards
- Sufficient color contrast (dark theme with light text)
