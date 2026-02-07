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
    constructor(x, y, character) {
        super(x, y, 30, 40, 'black');
        this.vx = 0;
        this.vy = 0;
        this.speed = 300;
        this.jumpForce = -700;
        this.isGrounded = false;
        this.isDead = false;
        this.character = character || 'leo';
    }

    update(dt) {
        if (this.isDead) return;
    }

    draw(ctx, camera) {
        const sx = Math.floor(this.x - camera.x);
        const sy = Math.floor(this.y - camera.y);

        if (this.character === 'leo') {
            this.drawLeo(ctx, sx, sy);
        } else {
            this.drawBowman(ctx, sx, sy);
        }
    }

    drawLeo(ctx, sx, sy) {
        // Leo Trooper - dark helmet with visor, dark outfit
        // Body (dark suit)
        ctx.fillStyle = '#1a1a2e';
        ctx.fillRect(sx + 5, sy + 16, 20, 16);

        // Legs
        ctx.fillStyle = '#1a1a2e';
        ctx.fillRect(sx + 7, sy + 32, 7, 8);
        ctx.fillRect(sx + 16, sy + 32, 7, 8);

        // Arms
        ctx.fillStyle = '#1a1a2e';
        ctx.fillRect(sx + 1, sy + 17, 5, 12);
        ctx.fillRect(sx + 24, sy + 17, 5, 12);

        // Helmet (rounded top)
        ctx.fillStyle = '#3a3a4a';
        ctx.beginPath();
        ctx.ellipse(sx + 15, sy + 8, 13, 11, 0, Math.PI, 0);
        ctx.fill();
        ctx.fillRect(sx + 2, sy + 8, 26, 10);

        // Visor (blue-gray slit)
        ctx.fillStyle = '#5577aa';
        ctx.fillRect(sx + 4, sy + 8, 22, 5);

        // Visor shine
        ctx.fillStyle = '#8899bb';
        ctx.fillRect(sx + 6, sy + 9, 8, 2);
    }

    drawBowman(ctx, sx, sy) {
        // Bowman Phone - brown hair, red shirt, friendly face
        // Body (red shirt)
        ctx.fillStyle = '#cc2222';
        ctx.fillRect(sx + 5, sy + 16, 20, 16);

        // Legs (blue jeans)
        ctx.fillStyle = '#2244aa';
        ctx.fillRect(sx + 7, sy + 32, 7, 8);
        ctx.fillRect(sx + 16, sy + 32, 7, 8);

        // Arms (red shirt)
        ctx.fillStyle = '#cc2222';
        ctx.fillRect(sx + 1, sy + 17, 5, 12);
        ctx.fillRect(sx + 24, sy + 17, 5, 12);

        // Skin (hands)
        ctx.fillStyle = '#f4c99b';
        ctx.fillRect(sx + 1, sy + 27, 5, 3);
        ctx.fillRect(sx + 24, sy + 27, 5, 3);

        // Head (skin)
        ctx.fillStyle = '#f4c99b';
        ctx.beginPath();
        ctx.ellipse(sx + 15, sy + 9, 11, 10, 0, 0, Math.PI * 2);
        ctx.fill();

        // Hair (brown, on top)
        ctx.fillStyle = '#5a3825';
        ctx.beginPath();
        ctx.ellipse(sx + 15, sy + 5, 12, 7, 0, Math.PI, 0);
        ctx.fill();
        // Side hair
        ctx.fillRect(sx + 3, sy + 3, 4, 6);
        ctx.fillRect(sx + 23, sy + 3, 4, 6);

        // Eyes
        ctx.fillStyle = '#222';
        ctx.fillRect(sx + 10, sy + 8, 3, 3);
        ctx.fillRect(sx + 18, sy + 8, 3, 3);

        // Smile
        ctx.strokeStyle = '#222';
        ctx.lineWidth = 1.5;
        ctx.beginPath();
        ctx.arc(sx + 15, sy + 12, 4, 0.1 * Math.PI, 0.9 * Math.PI);
        ctx.stroke();
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
