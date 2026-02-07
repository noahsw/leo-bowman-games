import { Utils } from './utils.js';

export class PhysicsEngine {
    constructor() {
        this.gravity = 1500; // Pixels per second squared
        this.terminalVelocity = 800;
    }

    update(dt, player, entities) {
        if (player.isDead) return;

        // Apply Gravity
        player.vy += this.gravity * dt;
        player.vy = Math.min(player.vy, this.terminalVelocity);

        // --- Horizontal Movement & Collision ---
        player.x += player.vx * dt;
        
        // Boundary Enforcement (Left Wall)
        if (player.x < 0) {
            player.x = 0;
            player.vx = 0;
        }
        
        let playerRect = {x: player.x, y: player.y, w: player.w, h: player.h};
        
        for (const entity of entities) {
            if (entity.type === 'platform' && this.checkCollision(playerRect, entity)) {
                // Resolve Horizontal Collision
                if (player.vx > 0) { // Moving right
                    player.x = entity.x - player.w;
                } else if (player.vx < 0) { // Moving left
                    player.x = entity.x + entity.w;
                }
            }
        }

        // --- Vertical Movement & Collision ---
        player.y += player.vy * dt;
        playerRect.x = player.x; // Update rect with corrected x
        playerRect.y = player.y;
        
        player.isGrounded = false;

        for (const entity of entities) {
            if (entity.type === 'platform' && this.checkCollision(playerRect, entity)) {
                // Resolve Vertical Collision
                if (player.vy > 0) { // Falling down
                    player.y = entity.y - player.h;
                    player.vy = 0;
                    player.isGrounded = true;
                    
                    // Trigger Skeleton Block
                    if (entity.startCrumble) {
                        entity.startCrumble();
                    }
                } else if (player.vy < 0) { // Jumping up (hit ceiling)
                    player.y = entity.y + entity.h;
                    player.vy = 0;
                }
            }
        }
    }

    // Attempt to jump
    jump(player) {
        if (player.isGrounded) {
            player.vy = player.jumpForce;
            player.isGrounded = false;
        }
    }

    checkTriggers(player, entities) {
        const playerRect = {x: player.x, y: player.y, w: player.w, h: player.h};
        
        // Shrink hitbox slightly for hazards to be fair
        const hazardRect = {
            x: player.x + 5, 
            y: player.y + 5, 
            w: player.w - 10, 
            h: player.h - 10
        };
        
        // Check Entity Triggers
        for (const entity of entities) {
            if (entity.type === 'key') {
                if (this.checkCollision(playerRect, entity)) {
                    return { type: 'level_complete', entity: entity };
                }
            } else if (entity.type === 'spike') {
                if (this.checkCollision(hazardRect, entity)) {
                    return { type: 'player_death', entity: entity };
                }
            } else if (entity.type === 'star') {
                if (this.checkCollision(playerRect, entity)) {
                     // Don't collect twice
                     if (!entity.toBeRemoved) {
                         entity.toBeRemoved = true;
                         return { type: 'star_collected', entity: entity };
                     }
                }
            }
        }
        
        // Check Pit Death (Global)
        if (player.y > 800) { 
             return { type: 'player_death', entity: null };
        }
        
        return null;
    }

    // Check collision between a dynamic entity (box1) and a static entity (box2)
    checkCollision(box1, box2) {
        return Utils.rectIntersect(box1, box2);
    }
}
