export class Entity {
    constructor(x, y, w, h, color) {
        this.x = x;
        this.y = y;
        this.w = w;
        this.h = h;
        this.color = color || 'white';
        this.toBeRemoved = false;
    }

    update(dt) {
        // Base update logic
    }

    draw(ctx, camera) {
        ctx.fillStyle = this.color;
        // Adjust position based on camera
        ctx.fillRect(Math.floor(this.x - camera.x), Math.floor(this.y - camera.y), this.w, this.h);
    }
}

export class Player extends Entity {
    constructor(x, y) {
        super(x, y, 30, 30, 'black');
        this.vx = 0;
        this.vy = 0;
        this.speed = 300;
        this.jumpForce = -700;
        this.isGrounded = false;
        this.isDead = false;
    }

    update(dt) {
        if (this.isDead) return;
        
        // Physics integration will happen in PhysicsEngine
        // This method will be used for state updates and animation logic
    }
}

export class Platform extends Entity {
    constructor(x, y, w, h, color) {
        super(x, y, w, h, color || '#666');
        this.type = 'platform';
    }
}

export class Key extends Entity {
    constructor(x, y) {
        super(x, y, 40, 40, '#00ff00'); // Green key
        this.type = 'key';
    }
}

export class Spike extends Entity {
    constructor(x, y) {
        // Spikes are typically smaller/triangle, but box for AABB
        super(x, y, 30, 30, '#ff0000'); 
        this.type = 'spike';
    }
    
    // Override draw to make it look like a triangle
    draw(ctx, camera) {
        ctx.fillStyle = this.color;
        const screenX = this.x - camera.x;
        const screenY = this.y - camera.y;
        
        ctx.beginPath();
        ctx.moveTo(screenX, screenY + this.h);
        ctx.lineTo(screenX + this.w / 2, screenY);
        ctx.lineTo(screenX + this.w, screenY + this.h);
        ctx.fill();
    }
}

export class SkeletonBlock extends Platform {
    constructor(x, y, w, h) {
        super(x, y, w, h, '#ddd'); // Bone color
        this.type = 'platform'; // Acts as platform for collision initially
        this.isCrumbling = false;
        this.crumbleTimer = 0;
        this.crumbleDuration = 2.0; // 2 seconds
        this.shakeOffset = {x: 0, y: 0};
    }

    startCrumble() {
        if (!this.isCrumbling) {
            this.isCrumbling = true;
            this.color = '#bbb';
        }
    }

    update(dt) {
        if (this.isCrumbling) {
            this.crumbleTimer += dt;
            
            // Visual Shake effect
            if (this.crumbleTimer > 0) {
                 this.shakeOffset.x = (Math.random() - 0.5) * 5 * (this.crumbleTimer / this.crumbleDuration);
                 this.shakeOffset.y = (Math.random() - 0.5) * 5 * (this.crumbleTimer / this.crumbleDuration);
            }

            if (this.crumbleTimer >= this.crumbleDuration) {
                this.toBeRemoved = true;
            }
        }
    }

    draw(ctx, camera) {
        ctx.fillStyle = this.color;
        ctx.fillRect(
            this.x - camera.x + this.shakeOffset.x, 
            this.y - camera.y + this.shakeOffset.y, 
            this.w, 
            this.h
        );
    }
}

export class Star extends Entity {
    constructor(x, y) {
        super(x, y, 20, 20, '#FFD700'); // Gold
        this.type = 'star';
    }
    
    draw(ctx, camera) {
        ctx.fillStyle = this.color;
        const screenX = this.x - camera.x;
        const screenY = this.y - camera.y;
        
        ctx.beginPath();
        // Simple diamond shape for star
        ctx.moveTo(screenX + 10, screenY);
        ctx.lineTo(screenX + 20, screenY + 10);
        ctx.lineTo(screenX + 10, screenY + 20);
        ctx.lineTo(screenX, screenY + 10);
        ctx.fill();
    }
}
