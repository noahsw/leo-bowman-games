import { PhysicsEngine } from '../src/physics.js';
import { Player, Platform, Spike } from '../src/entities.js';

export function runPhysicsTests(assert) {
    console.log('Running Physics Tests...');

    // Test 1: AABB Collision
    {
        const physics = new PhysicsEngine();
        const box1 = { x: 0, y: 0, w: 10, h: 10 };
        const box2 = { x: 5, y: 5, w: 10, h: 10 };
        const box3 = { x: 20, y: 20, w: 10, h: 10 };

        assert(physics.checkCollision(box1, box2), 'Overlapping boxes should collide');
        assert(!physics.checkCollision(box1, box3), 'Distant boxes should not collide');
    }

    // Test 2: Gravity
    {
        const physics = new PhysicsEngine();
        const player = new Player(0, 0);
        const dt = 0.1;
        const initialY = player.y;
        
        physics.update(dt, player, []);
        
        assert(player.y > initialY, 'Gravity should pull player down');
        assert(player.vy > 0, 'Velocity should increase due to gravity');
    }

    // Test 3: Platform Collision (Ground Detection)
    {
        const physics = new PhysicsEngine();
        const player = new Player(0, 0); // 30x30
        const platform = new Platform(0, 50, 100, 10);
        
        // Place player just above platform and falling
        player.y = 25; // Bottom at 55
        player.vy = 100;
        
        // Update to trigger collision
        physics.update(0.1, player, [platform]);
        
        assert(player.isGrounded, 'Player should be grounded after hitting platform');
        assert(player.vy === 0, 'Vertical velocity should reset on landing');
        assert(player.y === platform.y - player.h, 'Player should be on top of platform');
    }

    // Test 4: Spike Trigger
    {
        const physics = new PhysicsEngine();
        const player = new Player(0, 0);
        const spike = new Spike(0, 0); // Overlapping
        
        const event = physics.checkTriggers(player, [spike]);
        
        assert(event && event.type === 'player_death', 'Spike collision should trigger death');
    }
}
