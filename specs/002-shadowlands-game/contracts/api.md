# API Contract: Internal Classes

## LevelGenerator

```javascript
class LevelGenerator {
    /**
     * Generates a new level based on difficulty.
     * @param {number} levelNumber - Current level (1+)
     * @returns {LevelData} List of entities and spawn points
     */
    generate(levelNumber) {}
}
```

## SaveManager

```javascript
class SaveManager {
    save(level, score) {}
    load() // returns { level, score }
    clear()
}
```

## PhysicsEngine

```javascript
class PhysicsEngine {
    /**
     * Updates positions and handles collisions.
     * @param {number} dt - Delta time in seconds
     * @param {Player} player
     * @param {Array} entities
     */
    update(dt, player, entities) {}
}
```
