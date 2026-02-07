# Quickstart: Shadowlands Development

## 1. Directory Structure

The game lives in `games/shadowlands/`.

## 2. Running the Game

Because the game uses ES Modules (`import`/`export`), you **must** use a local web server. Opening the file directly will cause CORS errors.

Run one of the following commands from the project root:

**Using Node.js (Recommended):**
```bash
npx serve .
```

**Using Python:**
```bash
python3 -m http.server
```

Then open your browser to the URL shown (usually `http://localhost:3000` or `http://localhost:8000`) and navigate to `games/shadowlands/`.

## 3. Key Components

- **GameLoop**: Main update/draw cycle.
- **LevelGenerator**: Logic to stitch segments.
- **Physics**: Collision detection system.

## 4. Debugging

- Press `D` (if implemented) to toggle debug hitboxes.
- Check console for level generation logs.
