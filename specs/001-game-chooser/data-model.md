# Data Model: Game Selector Homepage

**Feature**: 001-game-chooser
**Date**: 2026-02-01

## Overview

This feature uses a simple static data model. Game information is represented directly in HTML rather than a separate data store.

## Entities

### Game

Represents a playable game in the collection.

| Attribute | Type | Required | Description |
|-----------|------|----------|-------------|
| id | string | Yes | URL-safe identifier (directory name) |
| title | string | Yes | Display name shown on card |
| description | string | No | Short tagline (1 sentence) |
| previewImage | path | Yes | Relative path to preview image |
| entryPoint | path | Yes | Relative path to game's index.html |

**Example** (Terror Castle):
```
id: "terror-castle"
title: "Terror Castle"
description: "Defend the Gem of Darkness from the trolls!"
previewImage: "games/terror-castle/preview.png"
entryPoint: "games/terror-castle/index.html"
```

### HTML Representation

Games are represented as cards in the selector page:

```html
<article class="game-card">
    <a href="games/terror-castle/index.html">
        <img src="games/terror-castle/preview.png"
             alt="Terror Castle preview"
             loading="lazy">
        <h2>Terror Castle</h2>
        <p>Defend the Gem of Darkness from the trolls!</p>
    </a>
</article>
```

## Relationships

```
Game Selector (index.html)
    └── contains 1..n Game Cards
            └── links to 1 Game Page (games/*/index.html)
                    └── links back to Game Selector
```

## State

This is a static site with no persistent state. All navigation uses standard HTTP page loads.

## Validation Rules

| Rule | Enforcement |
|------|-------------|
| Game id must be URL-safe | Manual (no special characters, lowercase, hyphens for spaces) |
| Preview image must exist | Build/deploy verification |
| Entry point must exist | Build/deploy verification |
| Title max length | 30 characters (recommended for display) |
| Description max length | 60 characters (recommended for card layout) |

## Future Considerations

If the game collection grows significantly (10+), consider:
- JSON catalog file with JavaScript rendering
- Category/tag filtering
- Search functionality
- Pagination or infinite scroll

For now, hardcoded HTML is sufficient for 1-6 games.
