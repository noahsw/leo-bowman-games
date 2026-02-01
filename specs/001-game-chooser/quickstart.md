# Quickstart: Game Selector Homepage

**Feature**: 001-game-chooser
**Date**: 2026-02-01

## Prerequisites

- Modern web browser (Chrome, Firefox, Safari, or Edge)
- Local file server (for development) or any static hosting

## Local Development

### Option 1: Python HTTP Server

```bash
# Navigate to project root
cd /path/to/leo-bowman-games

# Start local server
python3 -m http.server 8000

# Open in browser
open http://localhost:8000
```

### Option 2: Node.js HTTP Server

```bash
# Install serve globally (one-time)
npm install -g serve

# Start server
serve .

# Open in browser (default port 3000)
open http://localhost:3000
```

### Option 3: VS Code Live Server

1. Install the "Live Server" extension in VS Code
2. Right-click `index.html`
3. Select "Open with Live Server"

## Project Structure

```
leo-bowman-games/
├── index.html           # Game Selector homepage
├── selector.css         # Selector page styles
└── games/
    └── terror-castle/
        ├── index.html   # Terror Castle game
        ├── game.js      # Game logic
        ├── styles.css   # Game styles
        └── preview.png  # Preview image (400x300)
```

## Adding a New Game

1. **Create game directory**:
   ```bash
   mkdir games/my-new-game
   ```

2. **Add game files**:
   - `index.html` - Game entry point
   - `game.js` - Game logic
   - `styles.css` - Game styles
   - `preview.png` - 400x300px preview image

3. **Add "Back to Games" header** to your game's `index.html`:
   ```html
   <header class="game-header">
       <a href="../../index.html" class="back-link">← Back to Games</a>
       <span class="game-title">My New Game</span>
   </header>
   ```

4. **Add game card** to root `index.html`:
   ```html
   <article class="game-card">
       <a href="games/my-new-game/index.html">
           <img src="games/my-new-game/preview.png"
                alt="My New Game preview"
                loading="lazy">
           <h2>My New Game</h2>
           <p>Short description of your game.</p>
       </a>
   </article>
   ```

## Testing

1. **Selector Page**:
   - Verify all game cards display correctly
   - Click each game card to confirm navigation works
   - Test on mobile viewport (responsive layout)

2. **Game Pages**:
   - Verify "Back to Games" link works
   - Confirm game loads and plays correctly
   - Test browser back button

## Deployment

This is a static site. Deploy to any static hosting:

- **GitHub Pages**: Push to `gh-pages` branch or enable in repo settings
- **Netlify**: Connect repo or drag-and-drop folder
- **Vercel**: Connect repo
- **Any web server**: Upload files to public directory

No build step required.
