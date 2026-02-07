import { Platform, Key, Spike, SkeletonBlock, Star } from './entities.js?v=2';
import { Utils } from './utils.js?v=2';
import { LevelSegments } from './level-data.js?v=2';

export class LevelGenerator {
    constructor() {
    }

    generate(levelNumber) {
        const entities = [];
        
        // Base Start Floor - Aligned with typical segment height (400)
        entities.push(new Platform(0, 400, 400, 50));
        
        let currentX = 400;
        // Increase level length with difficulty
        const totalSegments = 2 + Math.floor(levelNumber / 2);
        
        for (let i = 0; i < totalSegments; i++) {
            // Pick a segment based on difficulty scaling
            // Higher levels unlock harder segments
            const maxDifficulty = Math.min(3, 1 + Math.floor(levelNumber / 3));
            
            // Filter eligible segments
            const eligible = LevelSegments.filter(s => s.difficulty <= maxDifficulty);
            const segment = eligible[Utils.randomInt(0, eligible.length - 1)];
            
            // Stitch segment
            segment.layout.forEach(item => {
                const posX = currentX + item.x;
                const posY = item.y; // Keep Y absolute for simplicity, could vary
                
                if (item.type === 'platform') {
                    entities.push(new Platform(posX, posY, item.w, item.h));
                } else if (item.type === 'skeleton') {
                    entities.push(new SkeletonBlock(posX, posY, item.w, item.h));
                } else if (item.type === 'spike') {
                    entities.push(new Spike(posX, posY));
                } else if (item.type === 'star') {
                    entities.push(new Star(posX, posY));
                }
            });
            
            // Add random gap between segments (small on early levels)
            const minGap = levelNumber <= 2 ? 20 : 50;
            const maxGap = levelNumber <= 2 ? 60 : 150 + (levelNumber * 10);
            currentX += segment.width + Utils.randomInt(minGap, maxGap);
        }
        
        // Final Platform for Key
        entities.push(new Platform(currentX, 400, 200, 50));
        
        // Add Key
        const key = new Key(currentX + 80, 340);
        entities.push(key);
        
        return {
            playerStart: { x: 50, y: 300 },
            entities: entities,
            levelWidth: currentX + 500
        };
    }
}
