import { LevelGenerator } from '../src/level-gen.js';

export function runLevelGenTests(assert) {
    console.log('Running Level Generator Tests...');

    // Test 1: Level Generation Structure
    {
        const gen = new LevelGenerator();
        const level = gen.generate(1);
        
        assert(level.entities.length > 0, 'Level should have entities');
        assert(level.playerStart, 'Level should have start position');
        assert(level.playerStart.x === 50, 'Start X should be standard');
    }

    // Test 2: Difficulty Scaling (Entity count check as proxy)
    {
        const gen = new LevelGenerator();
        const level1 = gen.generate(1);
        const level10 = gen.generate(10);
        
        // Higher levels should be longer/have more segments
        assert(level10.levelWidth > level1.levelWidth, 'Level 10 should be longer than Level 1');
    }
}
