# HTML Structure Contracts

**Feature**: 001-game-chooser
**Date**: 2026-02-01

## Game Selector Page (index.html)

```html
<!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>Leo & Bowman Games</title>
    <link rel="stylesheet" href="selector.css">
</head>
<body>
    <header class="site-header">
        <h1 class="site-title">Leo & Bowman Games</h1>
        <p class="site-tagline">Choose your adventure!</p>
    </header>

    <main class="game-grid">
        <!-- Game cards go here -->
        <article class="game-card">
            <a href="games/{game-id}/index.html">
                <div class="game-preview">
                    <img src="games/{game-id}/preview.png"
                         alt="{Game Title} preview"
                         loading="lazy">
                </div>
                <div class="game-info">
                    <h2>{Game Title}</h2>
                    <p>{Game Description}</p>
                </div>
            </a>
        </article>
        <!-- Repeat for each game -->
    </main>

    <footer class="site-footer">
        <p>Made with ❤️ for Leo and Bowman</p>
    </footer>
</body>
</html>
```

## Game Page Header Component

Add this header to each game's `index.html`:

```html
<header class="game-header">
    <a href="../../index.html" class="back-link">
        <span class="back-arrow">←</span>
        <span class="back-text">Back to Games</span>
    </a>
    <span class="game-title">{Game Title}</span>
</header>
```

### CSS for Game Header

Include in each game's `styles.css`:

```css
.game-header {
    position: fixed;
    top: 0;
    left: 0;
    right: 0;
    height: 40px;
    background: rgba(10, 10, 26, 0.95);
    display: flex;
    align-items: center;
    justify-content: space-between;
    padding: 0 1rem;
    z-index: 1000;
    border-bottom: 2px solid #9400D3;
}

.back-link {
    color: #9400D3;
    text-decoration: none;
    font-weight: bold;
    display: flex;
    align-items: center;
    gap: 0.5rem;
}

.back-link:hover {
    color: #BA55D3;
}

.game-title {
    color: #FFD700;
    font-weight: bold;
}
```

## CSS Class Contracts

### Selector Page Classes

| Class | Purpose |
|-------|---------|
| `.site-header` | Top header with site title |
| `.site-title` | Main heading (h1) |
| `.site-tagline` | Subtitle/description |
| `.game-grid` | Container for game cards (CSS Grid) |
| `.game-card` | Individual game card |
| `.game-preview` | Preview image container |
| `.game-info` | Title and description container |
| `.site-footer` | Bottom footer |

### Game Page Classes

| Class | Purpose |
|-------|---------|
| `.game-header` | Fixed top navigation bar |
| `.back-link` | Link back to game selector |
| `.back-arrow` | Arrow icon in back link |
| `.back-text` | Text in back link |
| `.game-title` | Game name in header |
| `.game-container` | Existing game canvas container |

## Accessibility Requirements

- All images must have descriptive `alt` text
- Links must have visible focus states
- Color contrast ratio minimum 4.5:1 for text
- Interactive elements minimum 44x44px touch target
- Semantic HTML elements (`<header>`, `<main>`, `<article>`, `<footer>`)
