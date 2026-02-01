// ============================================================================
// TERROR CASTLE - Test Suite
// Run these tests by opening tests.html in a browser
// ============================================================================

class TestRunner {
    constructor() {
        this.tests = [];
        this.passed = 0;
        this.failed = 0;
        this.results = [];
    }

    test(name, fn) {
        this.tests.push({ name, fn });
    }

    async run() {
        console.log('Running Terror Castle Tests...\n');

        for (const test of this.tests) {
            try {
                await test.fn();
                this.passed++;
                this.results.push({ name: test.name, passed: true });
                console.log(`✓ ${test.name}`);
            } catch (error) {
                this.failed++;
                this.results.push({ name: test.name, passed: false, error: error.message });
                console.error(`✗ ${test.name}`);
                console.error(`  Error: ${error.message}`);
            }
        }

        console.log(`\n${this.passed} passed, ${this.failed} failed`);
        return this.failed === 0;
    }

    assertEqual(actual, expected, message = '') {
        if (actual !== expected) {
            throw new Error(`${message} Expected ${expected}, got ${actual}`);
        }
    }

    assertTrue(value, message = '') {
        if (!value) {
            throw new Error(`${message} Expected true, got ${value}`);
        }
    }

    assertFalse(value, message = '') {
        if (value) {
            throw new Error(`${message} Expected false, got ${value}`);
        }
    }

    assertInRange(value, min, max, message = '') {
        if (value < min || value > max) {
            throw new Error(`${message} Expected ${value} to be between ${min} and ${max}`);
        }
    }
}

// ============================================================================
// TROLL TESTS
// ============================================================================

function createTestTroll(floor = 1, health = 100, speed = 50) {
    return new Troll(100, 400, floor, speed, health);
}

function runTrollTests(runner) {
    runner.test('Troll: initializes with correct health', () => {
        const troll = createTestTroll(1, 100);
        runner.assertEqual(troll.health, 100, 'Health');
        runner.assertEqual(troll.maxHealth, 100, 'Max health');
    });

    runner.test('Troll: takeDamage reduces health', () => {
        const troll = createTestTroll(1, 100);
        troll.takeDamage(25);
        runner.assertEqual(troll.health, 75, 'Health after damage');
    });

    runner.test('Troll: takeDamage with 0 does not change health', () => {
        const troll = createTestTroll(1, 100);
        troll.takeDamage(0);
        runner.assertEqual(troll.health, 100, 'Health after 0 damage');
    });

    runner.test('Troll: health never goes below 0 visually', () => {
        const troll = createTestTroll(1, 50);
        troll.takeDamage(100); // Overkill damage
        const healthPercent = Math.max(0, Math.min(1, troll.health / troll.maxHealth));
        runner.assertInRange(healthPercent, 0, 1, 'Health percent clamped');
    });

    runner.test('Troll: dies when health reaches 0', () => {
        const troll = createTestTroll(1, 50);
        troll.takeDamage(50);
        runner.assertEqual(troll.state, 'dying', 'State should be dying');
        runner.assertEqual(troll.health, 0, 'Health should be 0');
    });

    runner.test('Troll: dies when health goes negative', () => {
        const troll = createTestTroll(1, 50);
        troll.takeDamage(100);
        runner.assertEqual(troll.state, 'dying', 'State should be dying');
        runner.assertTrue(troll.health < 0, 'Health should be negative');
    });

    runner.test('Troll: stun sets correct state and timer', () => {
        const troll = createTestTroll();
        troll.stun(2000);
        runner.assertEqual(troll.state, 'stunned', 'State');
        runner.assertEqual(troll.stunTimer, 2000, 'Stun timer');
    });

    runner.test('Troll: slow reduces speed correctly', () => {
        const troll = createTestTroll(1, 100, 100);
        troll.slow(0.3, 3000);
        runner.assertEqual(troll.speed, 30, 'Speed after slow');
        runner.assertEqual(troll.slowTimer, 3000, 'Slow timer');
    });

    runner.test('Troll: floor 1 direction is right (1)', () => {
        const troll = createTestTroll(1);
        runner.assertEqual(troll.direction, 1, 'Direction on floor 1');
    });

    runner.test('Troll: floor 2 direction is left (-1)', () => {
        const troll = new Troll(100, 300, 2, 50, 100);
        runner.assertEqual(troll.direction, -1, 'Direction on floor 2');
    });

    runner.test('Troll: floor 3 direction is right (1)', () => {
        const troll = new Troll(100, 150, 3, 50, 100);
        runner.assertEqual(troll.direction, 1, 'Direction on floor 3');
    });

    runner.test('Troll: pointsAwarded initializes to false', () => {
        const troll = createTestTroll();
        runner.assertFalse(troll.pointsAwarded, 'Points should not be awarded initially');
    });

    runner.test('Troll: update moves troll in correct direction', () => {
        const troll = createTestTroll(1, 100, 100);
        const startX = troll.x;
        troll.update(1000); // 1 second
        runner.assertTrue(troll.x > startX, 'Troll should move right on floor 1');
    });

    runner.test('Troll: stunned troll does not move', () => {
        const troll = createTestTroll(1, 100, 100);
        troll.stun(5000);
        const startX = troll.x;
        troll.update(1000);
        runner.assertEqual(troll.x, startX, 'Stunned troll should not move');
    });

    runner.test('Troll: climbing troll does not move horizontally', () => {
        const troll = createTestTroll(1, 100, 100);
        troll.state = 'climbing';
        troll.x = 780; // At stairs
        const startX = troll.x;
        troll.update(100);
        runner.assertEqual(troll.x, startX, 'Climbing troll should not move horizontally');
    });
}

// ============================================================================
// TRAP TESTS
// ============================================================================

function runTrapTests(runner) {
    runner.test('SpikeTrap: initializes with correct properties', () => {
        const trap = new SpikeTrap(100, 400, 1);
        runner.assertEqual(trap.uses, 5, 'Uses');
        runner.assertEqual(trap.type.damage, 25, 'Damage');
        runner.assertEqual(trap.type.cost, 10, 'Cost');
    });

    runner.test('SpikeTrap: deals damage when activated', () => {
        const trap = new SpikeTrap(100, 400, 1);
        const troll = createTestTroll(1, 100);
        trap.activate(troll);
        runner.assertEqual(troll.health, 75, 'Troll health after spike');
    });

    runner.test('SpikeTrap: decrements uses when activated', () => {
        const trap = new SpikeTrap(100, 400, 1);
        const troll = createTestTroll();
        trap.activate(troll);
        runner.assertEqual(trap.uses, 4, 'Uses after activation');
    });

    runner.test('SpikeTrap: becomes inactive after uses depleted', () => {
        const trap = new SpikeTrap(100, 400, 1);
        const troll = createTestTroll(1, 1000); // High health to survive
        for (let i = 0; i < 5; i++) {
            trap.cooldown = 0; // Reset cooldown for testing
            trap.activate(troll);
        }
        runner.assertFalse(trap.active, 'Trap should be inactive');
    });

    runner.test('LightMachine: stuns troll when activated', () => {
        const trap = new LightMachine(100, 400, 1);
        const troll = createTestTroll();
        trap.activate(troll);
        runner.assertEqual(troll.state, 'stunned', 'Troll should be stunned');
        runner.assertTrue(troll.stunTimer > 0, 'Stun timer should be set');
    });

    runner.test('LightMachine: has unlimited uses', () => {
        const trap = new LightMachine(100, 400, 1);
        runner.assertEqual(trap.uses, Infinity, 'Uses should be infinite');
    });

    runner.test('LightMachine: deals small damage', () => {
        const trap = new LightMachine(100, 400, 1);
        const troll = createTestTroll(1, 100);
        trap.activate(troll);
        runner.assertEqual(troll.health, 90, 'Troll health after light (10 damage)');
    });

    runner.test('SlimePuddle: slows troll when activated', () => {
        const trap = new SlimePuddle(100, 400, 1);
        const troll = createTestTroll(1, 100, 100);
        trap.activate(troll);
        runner.assertEqual(troll.speed, 30, 'Troll speed after slime (0.3x)');
    });

    runner.test('SlimePuddle: does NOT deal damage', () => {
        const trap = new SlimePuddle(100, 400, 1);
        const troll = createTestTroll(1, 100);
        trap.activate(troll);
        runner.assertEqual(troll.health, 100, 'Troll health should be unchanged');
    });

    runner.test('BellTrap: has limited uses (3)', () => {
        const trap = new BellTrap(100, 400, 1);
        runner.assertEqual(trap.uses, 3, 'Bell should have 3 uses');
    });

    runner.test('Trap: cooldown prevents immediate reactivation', () => {
        const trap = new SpikeTrap(100, 400, 1);
        const troll = createTestTroll(1, 1000);

        trap.activate(troll);
        const healthAfterFirst = troll.health;

        // Try to activate again immediately (should fail due to cooldown)
        const result = trap.activate(troll);
        runner.assertFalse(result, 'Should not activate during cooldown');
        runner.assertEqual(troll.health, healthAfterFirst, 'Health should not change');
    });

    runner.test('Trap: canActivate returns false during cooldown', () => {
        const trap = new SpikeTrap(100, 400, 1);
        const troll = createTestTroll();
        trap.activate(troll);
        runner.assertFalse(trap.canActivate(), 'Should not be able to activate during cooldown');
    });

    runner.test('Trap: canActivate returns true after cooldown', () => {
        const trap = new SpikeTrap(100, 400, 1);
        const troll = createTestTroll();
        trap.activate(troll);
        trap.cooldown = 0; // Simulate cooldown expiring
        runner.assertTrue(trap.canActivate(), 'Should be able to activate after cooldown');
    });
}

// ============================================================================
// GEM TESTS
// ============================================================================

function runGemTests(runner) {
    runner.test('Gem: initializes with 100 health', () => {
        const gem = new Gem(450, 150);
        runner.assertEqual(gem.health, 100, 'Health');
        runner.assertEqual(gem.maxHealth, 100, 'Max health');
    });

    runner.test('Gem: health can be reduced', () => {
        const gem = new Gem(450, 150);
        gem.health -= 15;
        runner.assertEqual(gem.health, 85, 'Health after damage');
    });

    runner.test('Gem: health can reach 0', () => {
        const gem = new Gem(450, 150);
        gem.health = 0;
        runner.assertEqual(gem.health, 0, 'Health at 0');
    });
}

// ============================================================================
// COLLISION TESTS
// ============================================================================

function runCollisionTests(runner) {
    runner.test('AABB: detects overlapping rectangles', () => {
        const a = { left: 0, right: 50, top: 0, bottom: 50 };
        const b = { left: 25, right: 75, top: 25, bottom: 75 };
        const collides = a.left < b.right && a.right > b.left && a.top < b.bottom && a.bottom > b.top;
        runner.assertTrue(collides, 'Should detect collision');
    });

    runner.test('AABB: no collision for separated rectangles', () => {
        const a = { left: 0, right: 50, top: 0, bottom: 50 };
        const b = { left: 100, right: 150, top: 100, bottom: 150 };
        const collides = a.left < b.right && a.right > b.left && a.top < b.bottom && a.bottom > b.top;
        runner.assertFalse(collides, 'Should not detect collision');
    });

    runner.test('AABB: no collision for adjacent rectangles', () => {
        const a = { left: 0, right: 50, top: 0, bottom: 50 };
        const b = { left: 50, right: 100, top: 0, bottom: 50 }; // Touching but not overlapping
        const collides = a.left < b.right && a.right > b.left && a.top < b.bottom && a.bottom > b.top;
        runner.assertFalse(collides, 'Adjacent rectangles should not collide');
    });

    runner.test('Troll getBounds: returns correct bounds', () => {
        const troll = new Troll(100, 200, 1, 50, 100);
        const bounds = troll.getBounds();
        runner.assertEqual(bounds.left, 100, 'Left');
        runner.assertEqual(bounds.right, 150, 'Right (x + width)');
        runner.assertEqual(bounds.top, 200, 'Top');
        runner.assertEqual(bounds.bottom, 255, 'Bottom (y + height)');
    });
}

// ============================================================================
// GAME STATE TESTS
// ============================================================================

function runGameStateTests(runner) {
    runner.test('Game over triggers when gem health <= 0', () => {
        // This tests the logic, not the actual game
        const gemHealth = 0;
        const shouldGameOver = gemHealth <= 0;
        runner.assertTrue(shouldGameOver, 'Should trigger game over');
    });

    runner.test('Wave complete when no trolls and none to spawn', () => {
        const trollsToSpawn = 0;
        const trollsLength = 0;
        const waveComplete = trollsToSpawn === 0 && trollsLength === 0;
        runner.assertTrue(waveComplete, 'Wave should be complete');
    });

    runner.test('Wave not complete when trolls still exist', () => {
        const trollsToSpawn = 0;
        const trollsLength = 1;
        const waveComplete = trollsToSpawn === 0 && trollsLength === 0;
        runner.assertFalse(waveComplete, 'Wave should not be complete');
    });

    runner.test('Wave not complete when trolls still to spawn', () => {
        const trollsToSpawn = 3;
        const trollsLength = 0;
        const waveComplete = trollsToSpawn === 0 && trollsLength === 0;
        runner.assertFalse(waveComplete, 'Wave should not be complete');
    });
}

// ============================================================================
// FLOOR AND STAIRS TESTS
// ============================================================================

function runFloorTests(runner) {
    runner.test('FLOORS: has 3 floors', () => {
        runner.assertEqual(FLOORS.length, 3, 'Number of floors');
    });

    runner.test('FLOORS: floors are in correct vertical order', () => {
        runner.assertTrue(FLOORS[0].y > FLOORS[1].y, 'Floor 1 below floor 2');
        runner.assertTrue(FLOORS[1].y > FLOORS[2].y, 'Floor 2 below floor 3');
    });

    runner.test('FLOORS: floors do not overlap with trap UI (y < 490)', () => {
        const lowestFloorBottom = FLOORS[0].y + FLOORS[0].height;
        runner.assertTrue(lowestFloorBottom < 490, 'Lowest floor should be above trap UI');
    });

    runner.test('STAIRS: has 2 staircases', () => {
        runner.assertEqual(STAIRS.length, 2, 'Number of staircases');
    });

    runner.test('STAIRS: first staircase goes from floor 1 to 2', () => {
        runner.assertEqual(STAIRS[0].fromFloor, 1, 'From floor');
        runner.assertEqual(STAIRS[0].toFloor, 2, 'To floor');
    });

    runner.test('STAIRS: second staircase goes from floor 2 to 3', () => {
        runner.assertEqual(STAIRS[1].fromFloor, 2, 'From floor');
        runner.assertEqual(STAIRS[1].toFloor, 3, 'To floor');
    });
}

// ============================================================================
// LEVEL DATA TESTS
// ============================================================================

function runLevelTests(runner) {
    runner.test('LEVELS: has 3 levels', () => {
        runner.assertEqual(LEVELS.length, 3, 'Number of levels');
    });

    runner.test('LEVELS: each level has waves', () => {
        LEVELS.forEach((level, i) => {
            runner.assertTrue(level.waves.length > 0, `Level ${i + 1} should have waves`);
        });
    });

    runner.test('LEVELS: each level has startCoins', () => {
        LEVELS.forEach((level, i) => {
            runner.assertTrue(level.startCoins > 0, `Level ${i + 1} should have start coins`);
        });
    });

    runner.test('LEVELS: wave troll counts are positive', () => {
        LEVELS.forEach((level, levelIdx) => {
            level.waves.forEach((wave, waveIdx) => {
                runner.assertTrue(wave.trollCount > 0,
                    `Level ${levelIdx + 1} wave ${waveIdx + 1} should have trolls`);
            });
        });
    });

    runner.test('LEVELS: wave troll health is positive', () => {
        LEVELS.forEach((level, levelIdx) => {
            level.waves.forEach((wave, waveIdx) => {
                runner.assertTrue(wave.trollHealth > 0,
                    `Level ${levelIdx + 1} wave ${waveIdx + 1} trolls should have health`);
            });
        });
    });
}

// ============================================================================
// TRAP TYPE TESTS
// ============================================================================

function runTrapTypeTests(runner) {
    runner.test('TRAP_TYPES: has 4 trap types', () => {
        runner.assertEqual(TRAP_TYPES.length, 4, 'Number of trap types');
    });

    runner.test('TRAP_TYPES: all traps have positive costs', () => {
        TRAP_TYPES.forEach((trap, i) => {
            runner.assertTrue(trap.cost > 0, `Trap ${i + 1} should have positive cost`);
        });
    });

    runner.test('TRAP_TYPES: all traps have cooldowns', () => {
        TRAP_TYPES.forEach((trap, i) => {
            runner.assertTrue(trap.cooldown > 0, `Trap ${i + 1} should have cooldown`);
        });
    });

    runner.test('TRAP_TYPES: spike trap has highest damage', () => {
        const spikeDamage = TRAP_TYPES[0].damage;
        runner.assertEqual(spikeDamage, 25, 'Spike damage');
        runner.assertTrue(spikeDamage > TRAP_TYPES[1].damage, 'Spike > Light damage');
        runner.assertTrue(spikeDamage > TRAP_TYPES[2].damage, 'Spike > Slime damage');
        runner.assertTrue(spikeDamage > TRAP_TYPES[3].damage, 'Spike > Bell damage');
    });

    runner.test('TRAP_TYPES: slime trap has 0 damage', () => {
        runner.assertEqual(TRAP_TYPES[2].damage, 0, 'Slime should not deal damage');
    });

    runner.test('TRAP_TYPES: light trap has infinite uses', () => {
        runner.assertEqual(TRAP_TYPES[1].uses, Infinity, 'Light should have infinite uses');
    });
}

// ============================================================================
// HEALTH BAR RENDERING TESTS
// ============================================================================

function runHealthBarTests(runner) {
    runner.test('Health percent clamped: normal case', () => {
        const health = 50;
        const maxHealth = 100;
        const percent = Math.max(0, Math.min(1, health / maxHealth));
        runner.assertEqual(percent, 0.5, 'Should be 0.5');
    });

    runner.test('Health percent clamped: at max', () => {
        const health = 100;
        const maxHealth = 100;
        const percent = Math.max(0, Math.min(1, health / maxHealth));
        runner.assertEqual(percent, 1, 'Should be 1');
    });

    runner.test('Health percent clamped: at zero', () => {
        const health = 0;
        const maxHealth = 100;
        const percent = Math.max(0, Math.min(1, health / maxHealth));
        runner.assertEqual(percent, 0, 'Should be 0');
    });

    runner.test('Health percent clamped: negative health', () => {
        const health = -50;
        const maxHealth = 100;
        const percent = Math.max(0, Math.min(1, health / maxHealth));
        runner.assertEqual(percent, 0, 'Should be clamped to 0');
    });

    runner.test('Health percent clamped: over max (should not happen)', () => {
        const health = 150;
        const maxHealth = 100;
        const percent = Math.max(0, Math.min(1, health / maxHealth));
        runner.assertEqual(percent, 1, 'Should be clamped to 1');
    });
}

// ============================================================================
// RUN ALL TESTS
// ============================================================================

async function runAllTests() {
    const runner = new TestRunner();

    runTrollTests(runner);
    runTrapTests(runner);
    runGemTests(runner);
    runCollisionTests(runner);
    runGameStateTests(runner);
    runFloorTests(runner);
    runLevelTests(runner);
    runTrapTypeTests(runner);
    runHealthBarTests(runner);

    const allPassed = await runner.run();

    // Display results in the page if running in browser
    if (typeof document !== 'undefined') {
        displayResults(runner);
    }

    return allPassed;
}

function displayResults(runner) {
    const container = document.getElementById('test-results');
    if (!container) return;

    let html = `<h2>Test Results: ${runner.passed} passed, ${runner.failed} failed</h2>`;
    html += '<ul>';

    for (const result of runner.results) {
        const icon = result.passed ? '✓' : '✗';
        const className = result.passed ? 'passed' : 'failed';
        html += `<li class="${className}">${icon} ${result.name}`;
        if (result.error) {
            html += `<br><small style="color: #ff6666; margin-left: 20px;">${result.error}</small>`;
        }
        html += '</li>';
    }

    html += '</ul>';
    container.innerHTML = html;
}

// Auto-run if loaded in browser
if (typeof window !== 'undefined') {
    window.addEventListener('DOMContentLoaded', runAllTests);
}
