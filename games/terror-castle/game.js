// ============================================================================
// TERROR CASTLE - A Game for Leo and Bowman
// Defend the Gem of Darkness from the trolls!
// ============================================================================

// Game Constants
const CANVAS_WIDTH = 900;
const CANVAS_HEIGHT = 600;

const GameStates = {
    MENU: 'menu',
    TUTORIAL: 'tutorial',
    PLAYING: 'playing',
    PAUSED: 'paused',
    WAVE_COMPLETE: 'wave_complete',
    GAME_OVER: 'game_over',
    VICTORY: 'victory'
};

// Castle floor configuration
// Floors are positioned to leave room for the trap UI at the bottom (100px)
const FLOORS = [
    { id: 1, name: 'Ground Floor', y: 370, height: 110, color: '#5a4a3a' },
    { id: 2, name: 'Second Floor', y: 230, height: 110, color: '#6a5a4a' },
    { id: 3, name: 'Treasure Room', y: 90, height: 110, color: '#7a6a5a' }
];

// Stair positions - trolls use these to climb between floors
const STAIRS = [
    { x: 780, fromFloor: 1, toFloor: 2 },  // Right side: floor 1 -> 2
    { x: 100, fromFloor: 2, toFloor: 3 }   // Left side: floor 2 -> 3
];

// Level data
const LEVELS = [
    {
        name: 'The First Night',
        startCoins: 100,  // Enough to buy several traps!
        waveBonus: 25,    // Bonus coins after each wave
        waves: [
            { trollCount: 3, spawnDelay: 2500, trollSpeed: 40, trollHealth: 40 },
            { trollCount: 4, spawnDelay: 2200, trollSpeed: 45, trollHealth: 45 }
        ]
    },
    {
        name: 'Growing Threat',
        startCoins: 50,
        waveBonus: 30,
        waves: [
            { trollCount: 4, spawnDelay: 2000, trollSpeed: 50, trollHealth: 50 },
            { trollCount: 5, spawnDelay: 1800, trollSpeed: 55, trollHealth: 55 },
            { trollCount: 6, spawnDelay: 1600, trollSpeed: 55, trollHealth: 60 }
        ]
    },
    {
        name: 'Full Assault',
        startCoins: 60,
        waveBonus: 35,
        waves: [
            { trollCount: 5, spawnDelay: 1800, trollSpeed: 55, trollHealth: 60 },
            { trollCount: 6, spawnDelay: 1500, trollSpeed: 60, trollHealth: 65 },
            { trollCount: 8, spawnDelay: 1300, trollSpeed: 65, trollHealth: 70 }
        ]
    }
];

// Trap definitions
const TRAP_TYPES = [
    { name: 'Spike', fullName: 'Spike Platform', cost: 10, damage: 25, uses: 5, cooldown: 1500, color: '#8B4513', description: 'Sharp spikes pop up!' },
    { name: 'Light', fullName: 'Light Machine', cost: 25, damage: 10, uses: Infinity, cooldown: 2500, stunDuration: 2000, color: '#FFD700', description: 'Bright lights stun trolls!' },
    { name: 'Slime', fullName: 'Slime Puddle', cost: 15, damage: 0, uses: 10, cooldown: 500, slowFactor: 0.3, slowDuration: 3000, color: '#7CFC00', description: 'Gooey slime slows them down!' },
    { name: 'Bell', fullName: 'Loud Bell', cost: 30, damage: 5, uses: 3, cooldown: 4000, stunDuration: 1500, stunRadius: 150, color: '#FFD700', description: 'BONG! Stuns all nearby trolls!' }
];

// ============================================================================
// INPUT MANAGER
// ============================================================================
class InputManager {
    constructor() {
        this.keys = {};
        this.justPressed = {};

        window.addEventListener('keydown', (e) => {
            if (!this.keys[e.code]) {
                this.justPressed[e.code] = true;
            }
            this.keys[e.code] = true;

            // Prevent scrolling with arrow keys
            if (['ArrowUp', 'ArrowDown', 'ArrowLeft', 'ArrowRight', 'Space'].includes(e.code)) {
                e.preventDefault();
            }
        });

        window.addEventListener('keyup', (e) => {
            this.keys[e.code] = false;
        });
    }

    isDown(key) {
        return this.keys[key] || false;
    }

    isJustPressed(key) {
        return this.justPressed[key] || false;
    }

    getMovement() {
        return {
            up: this.isDown('ArrowUp') || this.isDown('KeyW'),
            down: this.isDown('ArrowDown') || this.isDown('KeyS'),
            left: this.isDown('ArrowLeft') || this.isDown('KeyA'),
            right: this.isDown('ArrowRight') || this.isDown('KeyD')
        };
    }

    isActionPressed() {
        return this.isJustPressed('Space') || this.isJustPressed('Enter');
    }

    getTrapSelection() {
        for (let i = 1; i <= 4; i++) {
            if (this.isJustPressed(`Digit${i}`) || this.isJustPressed(`Numpad${i}`)) {
                return i - 1;
            }
        }
        return null;
    }

    clearJustPressed() {
        this.justPressed = {};
    }
}

// ============================================================================
// TROLL CLASS
// ============================================================================
class Troll {
    constructor(x, y, floor, speed, health) {
        this.x = x;
        this.y = y;
        this.floor = floor;
        this.width = 50;
        this.height = 55;
        this.speed = speed;
        this.baseSpeed = speed;
        this.health = health;
        this.maxHealth = health;
        this.active = true;
        this.state = 'walking'; // walking, stunned, hurt, dying, climbing
        this.stunTimer = 0;
        this.slowTimer = 0;
        this.direction = 1; // 1 = right, -1 = left
        this.animFrame = 0;
        this.animTimer = 0;
        this.deathTimer = 0;
        this.hurtTimer = 0;
        this.climbTimer = 0;
        this.climbDuration = 800; // Time to climb stairs
        this.pointsAwarded = false; // Track if points were given for this troll

        // Set initial direction based on floor
        // Floor 1: walk right toward stairs at x=780
        // Floor 2: walk left toward stairs at x=100
        // Floor 3: walk right toward gem in center
        this.updateDirection();

        // Colors for variety
        const colors = ['#4a7c4e', '#5a8c5e', '#3a6c3e', '#4a8c6e'];
        this.color = colors[Math.floor(Math.random() * colors.length)];
    }

    updateDirection() {
        if (this.floor === 1) {
            this.direction = 1;  // Walk right toward stairs
        } else if (this.floor === 2) {
            this.direction = -1; // Walk left toward stairs
        } else {
            this.direction = 1;  // Walk right toward gem
        }
    }

    update(deltaTime) {
        if (!this.active) return;

        // Handle death animation
        if (this.state === 'dying') {
            this.deathTimer += deltaTime;
            if (this.deathTimer > 500) {
                this.active = false;
            }
            return;
        }

        // Handle climbing animation
        if (this.state === 'climbing') {
            this.climbTimer += deltaTime;
            // Animate moving up to next floor
            const progress = this.climbTimer / this.climbDuration;
            if (progress >= 1) {
                // Finished climbing - arrive on next floor
                this.floor++;
                const newFloor = FLOORS[this.floor - 1];
                this.y = newFloor.y + newFloor.height - 60;
                this.state = 'walking';
                this.climbTimer = 0;
                this.updateDirection();
            }
            return;
        }

        // Handle hurt flash
        if (this.hurtTimer > 0) {
            this.hurtTimer -= deltaTime;
        }

        // Handle stun
        if (this.stunTimer > 0) {
            this.stunTimer -= deltaTime;
            this.state = 'stunned';
            if (this.stunTimer <= 0) {
                this.state = 'walking';
            }
            return;
        }

        // Handle slow
        if (this.slowTimer > 0) {
            this.slowTimer -= deltaTime;
            if (this.slowTimer <= 0) {
                this.speed = this.baseSpeed;
            }
        }

        // Move
        this.state = 'walking';
        this.x += this.speed * this.direction * (deltaTime / 1000);

        // Check if reached stairs
        this.checkStairs();

        // Animation
        this.animTimer += deltaTime;
        if (this.animTimer > 150) {
            this.animFrame = (this.animFrame + 1) % 4;
            this.animTimer = 0;
        }
    }

    checkStairs() {
        // Find stairs for current floor
        const stair = STAIRS.find(s => s.fromFloor === this.floor);
        if (!stair) return; // No stairs from this floor (floor 3)

        // Check if troll reached the stairs
        const atStairs = Math.abs(this.x + this.width/2 - stair.x) < 30;
        if (atStairs) {
            this.state = 'climbing';
            this.climbTimer = 0;
            this.x = stair.x - this.width/2; // Center on stairs
        }
    }

    takeDamage(amount) {
        this.health -= amount;
        this.hurtTimer = 200;

        if (this.health <= 0) {
            this.state = 'dying';
            this.deathTimer = 0;
        }
    }

    stun(duration) {
        this.stunTimer = duration;
        this.state = 'stunned';
    }

    slow(factor, duration) {
        this.speed = this.baseSpeed * factor;
        this.slowTimer = duration;
    }

    getBounds() {
        return {
            left: this.x,
            right: this.x + this.width,
            top: this.y,
            bottom: this.y + this.height
        };
    }

    render(ctx) {
        if (!this.active) return;

        ctx.save();

        // Death fade
        if (this.state === 'dying') {
            ctx.globalAlpha = 1 - (this.deathTimer / 500);
        }

        // Climbing - interpolate Y position between floors
        let drawX = this.x;
        let drawY = this.y;

        if (this.state === 'climbing') {
            const progress = this.climbTimer / this.climbDuration;
            const currentFloor = FLOORS[this.floor - 1];
            const nextFloor = FLOORS[this.floor]; // Next floor up
            const startY = currentFloor.y + currentFloor.height - 60;
            const endY = nextFloor.y + nextFloor.height - 60;
            drawY = startY + (endY - startY) * progress;
        }

        // Hurt flash
        const isHurt = this.hurtTimer > 0;

        // Bounce animation (not while climbing)
        const bounce = this.state === 'climbing' ? 0 : Math.abs(Math.sin(this.animFrame * Math.PI / 2)) * 4;
        drawY = drawY - bounce;

        // Body
        ctx.fillStyle = isHurt ? '#ff6666' : this.color;
        ctx.beginPath();
        ctx.roundRect(this.x, drawY, this.width, this.height, 12);
        ctx.fill();

        // Darker belly
        ctx.fillStyle = isHurt ? '#ff8888' : this.adjustColor(this.color, 20);
        ctx.beginPath();
        ctx.ellipse(this.x + this.width/2, drawY + this.height - 15, 18, 12, 0, 0, Math.PI * 2);
        ctx.fill();

        // Eyes
        ctx.fillStyle = '#fff';
        ctx.beginPath();
        ctx.arc(this.x + 15, drawY + 18, 10, 0, Math.PI * 2);
        ctx.arc(this.x + 35, drawY + 18, 10, 0, Math.PI * 2);
        ctx.fill();

        // Pupils (look in walking direction)
        ctx.fillStyle = '#000';
        const pupilOffset = this.direction * 3;
        ctx.beginPath();
        ctx.arc(this.x + 15 + pupilOffset, drawY + 18, 5, 0, Math.PI * 2);
        ctx.arc(this.x + 35 + pupilOffset, drawY + 18, 5, 0, Math.PI * 2);
        ctx.fill();

        // Stunned eyes (X X)
        if (this.state === 'stunned') {
            ctx.strokeStyle = '#000';
            ctx.lineWidth = 3;
            // Left eye X
            ctx.beginPath();
            ctx.moveTo(this.x + 10, drawY + 13);
            ctx.lineTo(this.x + 20, drawY + 23);
            ctx.moveTo(this.x + 20, drawY + 13);
            ctx.lineTo(this.x + 10, drawY + 23);
            ctx.stroke();
            // Right eye X
            ctx.beginPath();
            ctx.moveTo(this.x + 30, drawY + 13);
            ctx.lineTo(this.x + 40, drawY + 23);
            ctx.moveTo(this.x + 40, drawY + 13);
            ctx.lineTo(this.x + 30, drawY + 23);
            ctx.stroke();
        }

        // Teeth
        ctx.fillStyle = '#fff';
        ctx.fillRect(this.x + 15, drawY + 38, 8, 10);
        ctx.fillRect(this.x + 27, drawY + 38, 8, 10);

        // Health bar (only show if damaged)
        if (this.health < this.maxHealth) {
            const barWidth = 40;
            const barHeight = 6;
            const barX = this.x + (this.width - barWidth) / 2;
            const barY = drawY - 12;

            ctx.fillStyle = '#333';
            ctx.fillRect(barX, barY, barWidth, barHeight);

            const healthPercent = Math.max(0, Math.min(1, this.health / this.maxHealth));
            ctx.fillStyle = healthPercent > 0.5 ? '#4CAF50' : (healthPercent > 0.25 ? '#ff9800' : '#f44336');
            ctx.fillRect(barX, barY, barWidth * healthPercent, barHeight);
        }

        // Stun stars
        if (this.state === 'stunned') {
            this.renderStunStars(ctx, drawY);
        }

        ctx.restore();
    }

    renderStunStars(ctx, drawY) {
        ctx.fillStyle = '#FFD700';
        const time = Date.now() / 500;
        for (let i = 0; i < 3; i++) {
            const angle = time + i * (Math.PI * 2 / 3);
            const starX = this.x + this.width/2 + Math.cos(angle) * 25;
            const starY = drawY - 5 + Math.sin(angle) * 8;
            this.drawStar(ctx, starX, starY, 6);
        }
    }

    drawStar(ctx, x, y, size) {
        ctx.beginPath();
        for (let i = 0; i < 5; i++) {
            const angle = (i * 4 * Math.PI / 5) - Math.PI / 2;
            const px = x + Math.cos(angle) * size;
            const py = y + Math.sin(angle) * size;
            if (i === 0) ctx.moveTo(px, py);
            else ctx.lineTo(px, py);
        }
        ctx.closePath();
        ctx.fill();
    }

    adjustColor(color, amount) {
        const num = parseInt(color.slice(1), 16);
        const r = Math.min(255, ((num >> 16) & 0xff) + amount);
        const g = Math.min(255, ((num >> 8) & 0xff) + amount);
        const b = Math.min(255, (num & 0xff) + amount);
        return `rgb(${r},${g},${b})`;
    }
}

// ============================================================================
// TRAP CLASSES
// ============================================================================
class Trap {
    constructor(x, y, floor, type) {
        this.x = x;
        this.y = y;
        this.floor = floor;
        this.type = type;
        this.width = 70;
        this.height = 25;
        this.uses = type.uses;
        this.cooldown = 0;
        this.active = true;
        this.isTriggered = false;
        this.triggerTimer = 0;
    }

    update(deltaTime) {
        if (this.cooldown > 0) {
            this.cooldown -= deltaTime;
        }
        if (this.triggerTimer > 0) {
            this.triggerTimer -= deltaTime;
            if (this.triggerTimer <= 0) {
                this.isTriggered = false;
            }
        }
    }

    canActivate() {
        return this.cooldown <= 0 && this.uses > 0 && this.active;
    }

    activate(troll) {
        if (!this.canActivate()) return false;

        this.isTriggered = true;
        this.triggerTimer = 400;
        this.cooldown = this.type.cooldown;

        if (this.uses !== Infinity) {
            this.uses--;
            if (this.uses <= 0) {
                this.active = false;
            }
        }

        return true;
    }

    getBounds() {
        return {
            left: this.x,
            right: this.x + this.width,
            top: this.y,
            bottom: this.y + this.height
        };
    }

    render(ctx) {
        // Override in subclasses
    }

    renderUsesIndicator(ctx) {
        if (this.uses !== Infinity && this.uses > 0) {
            ctx.fillStyle = '#fff';
            ctx.font = 'bold 12px Arial';
            ctx.textAlign = 'center';
            ctx.fillText(`${this.uses}`, this.x + this.width/2, this.y + this.height + 14);
        }
    }
}

class SpikeTrap extends Trap {
    constructor(x, y, floor) {
        super(x, y, floor, TRAP_TYPES[0]);
    }

    activate(troll) {
        if (!super.activate(troll)) return false;
        troll.takeDamage(this.type.damage);
        return true;
    }

    render(ctx) {
        if (!this.active) return;

        // Wooden platform
        ctx.fillStyle = '#8B4513';
        ctx.fillRect(this.x, this.y, this.width, this.height);

        // Wood grain
        ctx.strokeStyle = '#654321';
        ctx.lineWidth = 2;
        for (let i = 0; i < 3; i++) {
            ctx.beginPath();
            ctx.moveTo(this.x + 5, this.y + 6 + i * 7);
            ctx.lineTo(this.x + this.width - 5, this.y + 6 + i * 7);
            ctx.stroke();
        }

        // Spikes
        const spikeHeight = this.isTriggered ? 30 : 8;
        const spikeCount = 6;
        const spikeWidth = 8;
        const spacing = (this.width - spikeCount * spikeWidth) / (spikeCount + 1);

        ctx.fillStyle = '#C0C0C0';
        for (let i = 0; i < spikeCount; i++) {
            const spikeX = this.x + spacing + i * (spikeWidth + spacing);
            ctx.beginPath();
            ctx.moveTo(spikeX, this.y);
            ctx.lineTo(spikeX + spikeWidth/2, this.y - spikeHeight);
            ctx.lineTo(spikeX + spikeWidth, this.y);
            ctx.closePath();
            ctx.fill();

            // Spike shine
            ctx.strokeStyle = '#E8E8E8';
            ctx.lineWidth = 1;
            ctx.beginPath();
            ctx.moveTo(spikeX + 2, this.y - 2);
            ctx.lineTo(spikeX + spikeWidth/2, this.y - spikeHeight + 4);
            ctx.stroke();
        }

        this.renderUsesIndicator(ctx);
    }
}

class LightMachine extends Trap {
    constructor(x, y, floor) {
        super(x, y, floor, TRAP_TYPES[1]);
        this.height = 50;
        this.flashPhase = 0;
    }

    update(deltaTime) {
        super.update(deltaTime);
        if (this.isTriggered) {
            this.flashPhase += deltaTime * 0.03;
        }
    }

    activate(troll) {
        if (!super.activate(troll)) return false;
        troll.takeDamage(this.type.damage);
        troll.stun(this.type.stunDuration);
        return true;
    }

    render(ctx) {
        if (!this.active) return;

        // Machine body
        ctx.fillStyle = '#505050';
        ctx.fillRect(this.x + 10, this.y + 20, this.width - 20, this.height - 20);

        // Machine details
        ctx.fillStyle = '#404040';
        ctx.beginPath();
        ctx.arc(this.x + 20, this.y + 30, 4, 0, Math.PI * 2);
        ctx.arc(this.x + this.width - 20, this.y + 30, 4, 0, Math.PI * 2);
        ctx.arc(this.x + 20, this.y + this.height - 8, 4, 0, Math.PI * 2);
        ctx.arc(this.x + this.width - 20, this.y + this.height - 8, 4, 0, Math.PI * 2);
        ctx.fill();

        // Light bulb glow when triggered
        if (this.isTriggered) {
            const glowIntensity = Math.abs(Math.sin(this.flashPhase));
            const gradient = ctx.createRadialGradient(
                this.x + this.width/2, this.y + 10, 0,
                this.x + this.width/2, this.y + 10, 60
            );
            gradient.addColorStop(0, `rgba(255, 255, 100, ${glowIntensity})`);
            gradient.addColorStop(0.5, `rgba(255, 255, 0, ${glowIntensity * 0.5})`);
            gradient.addColorStop(1, 'rgba(255, 255, 0, 0)');
            ctx.fillStyle = gradient;
            ctx.beginPath();
            ctx.arc(this.x + this.width/2, this.y + 10, 60, 0, Math.PI * 2);
            ctx.fill();
        }

        // Bulb
        ctx.fillStyle = this.isTriggered ? '#FFFF00' : '#FFFFAA';
        ctx.beginPath();
        ctx.arc(this.x + this.width/2, this.y + 10, 15, 0, Math.PI * 2);
        ctx.fill();

        // Bulb base
        ctx.fillStyle = '#888';
        ctx.fillRect(this.x + this.width/2 - 8, this.y + 20, 16, 8);

        // Small indicator lights
        const colors = ['#ff0000', '#00ff00', '#0000ff'];
        for (let i = 0; i < 3; i++) {
            ctx.fillStyle = this.isTriggered ? colors[i] : '#333';
            ctx.beginPath();
            ctx.arc(this.x + 25 + i * 10, this.y + this.height - 5, 3, 0, Math.PI * 2);
            ctx.fill();
        }
    }
}

class SlimePuddle extends Trap {
    constructor(x, y, floor) {
        super(x, y, floor, TRAP_TYPES[2]);
        this.height = 15;
        this.bubbles = [];
        for (let i = 0; i < 5; i++) {
            this.bubbles.push({
                x: Math.random() * (this.width - 10) + 5,
                y: Math.random() * 8,
                size: Math.random() * 4 + 2,
                phase: Math.random() * Math.PI * 2
            });
        }
    }

    activate(troll) {
        if (!super.activate(troll)) return false;
        troll.slow(this.type.slowFactor, this.type.slowDuration);
        return true;
    }

    render(ctx) {
        if (!this.active) return;

        // Main puddle
        ctx.fillStyle = this.isTriggered ? '#9FFF00' : '#7CFC00';
        ctx.beginPath();
        ctx.ellipse(this.x + this.width/2, this.y + this.height/2, this.width/2, this.height/2, 0, 0, Math.PI * 2);
        ctx.fill();

        // Shine
        ctx.fillStyle = 'rgba(255, 255, 255, 0.3)';
        ctx.beginPath();
        ctx.ellipse(this.x + this.width/3, this.y + this.height/3, this.width/5, this.height/3, -0.3, 0, Math.PI * 2);
        ctx.fill();

        // Animated bubbles
        ctx.fillStyle = 'rgba(150, 255, 150, 0.6)';
        const time = Date.now() / 1000;
        this.bubbles.forEach(bubble => {
            const yOffset = Math.sin(time * 2 + bubble.phase) * 2;
            ctx.beginPath();
            ctx.arc(this.x + bubble.x, this.y + bubble.y + yOffset, bubble.size, 0, Math.PI * 2);
            ctx.fill();
        });

        this.renderUsesIndicator(ctx);
    }
}

class BellTrap extends Trap {
    constructor(x, y, floor) {
        super(x, y, floor, TRAP_TYPES[3]);
        this.width = 50;
        this.height = 55;
        this.swingAngle = 0;
        this.ringing = false;
    }

    update(deltaTime) {
        super.update(deltaTime);
        if (this.ringing) {
            this.swingAngle = Math.sin(Date.now() / 40) * 0.4;
        } else {
            this.swingAngle *= 0.9;
        }
        if (this.triggerTimer <= 0) {
            this.ringing = false;
        }
    }

    // Bell activates differently - it stuns all nearby trolls
    activateArea(trolls) {
        if (!this.canActivate()) return [];

        this.isTriggered = true;
        this.ringing = true;
        this.triggerTimer = 800;
        this.cooldown = this.type.cooldown;

        if (this.uses !== Infinity) {
            this.uses--;
            if (this.uses <= 0) {
                setTimeout(() => { this.active = false; }, 1000);
            }
        }

        // Find all trolls in radius on same floor
        const affected = [];
        const centerX = this.x + this.width/2;
        const centerY = this.y + this.height/2;

        trolls.forEach(troll => {
            if (troll.floor !== this.floor || !troll.active || troll.state === 'dying') return;

            const trollCenterX = troll.x + troll.width/2;
            const trollCenterY = troll.y + troll.height/2;
            const dx = trollCenterX - centerX;
            const dy = trollCenterY - centerY;
            const distance = Math.sqrt(dx * dx + dy * dy);

            if (distance <= this.type.stunRadius) {
                troll.takeDamage(this.type.damage);
                troll.stun(this.type.stunDuration);
                affected.push(troll);
            }
        });

        return affected;
    }

    render(ctx) {
        if (!this.active) return;

        ctx.save();
        ctx.translate(this.x + this.width/2, this.y + 5);
        ctx.rotate(this.swingAngle);

        // Support beam
        ctx.fillStyle = '#654321';
        ctx.fillRect(-4, 0, 8, 8);

        // Bell body
        ctx.fillStyle = '#FFD700';
        ctx.beginPath();
        ctx.moveTo(-20, 8);
        ctx.quadraticCurveTo(-25, this.height - 10, -28, this.height - 5);
        ctx.lineTo(28, this.height - 5);
        ctx.quadraticCurveTo(25, this.height - 10, 20, 8);
        ctx.closePath();
        ctx.fill();

        // Bell shine
        ctx.fillStyle = 'rgba(255, 255, 255, 0.4)';
        ctx.beginPath();
        ctx.ellipse(-8, 25, 6, 15, -0.2, 0, Math.PI * 2);
        ctx.fill();

        // Clapper
        ctx.fillStyle = '#8B4513';
        ctx.beginPath();
        ctx.arc(0, this.height - 12, 7, 0, Math.PI * 2);
        ctx.fill();

        ctx.restore();

        // Sound waves when ringing
        if (this.ringing) {
            this.renderSoundWaves(ctx);
        }

        this.renderUsesIndicator(ctx);
    }

    renderSoundWaves(ctx) {
        const centerX = this.x + this.width/2;
        const centerY = this.y + this.height/2;
        const time = Date.now() / 150;

        ctx.lineWidth = 3;
        for (let i = 0; i < 3; i++) {
            const radius = 20 + ((time + i * 15) % 60);
            const alpha = Math.max(0, 1 - radius / 80);
            ctx.strokeStyle = `rgba(255, 215, 0, ${alpha})`;
            ctx.beginPath();
            ctx.arc(centerX, centerY, radius, 0, Math.PI * 2);
            ctx.stroke();
        }
    }
}

// ============================================================================
// GEM OF DARKNESS
// ============================================================================
class Gem {
    constructor(x, y) {
        this.x = x;
        this.y = y;
        this.width = 50;
        this.height = 50;
        this.health = 100;
        this.maxHealth = 100;
    }

    getBounds() {
        return {
            left: this.x,
            right: this.x + this.width,
            top: this.y,
            bottom: this.y + this.height
        };
    }

    render(ctx) {
        const centerX = this.x + this.width/2;
        const centerY = this.y + this.height/2;
        const time = Date.now() / 1000;

        // Pulsing glow
        const glowSize = 50 + Math.sin(time * 2) * 10;
        const gradient = ctx.createRadialGradient(centerX, centerY, 0, centerX, centerY, glowSize);
        gradient.addColorStop(0, 'rgba(148, 0, 211, 0.8)');
        gradient.addColorStop(0.5, 'rgba(75, 0, 130, 0.4)');
        gradient.addColorStop(1, 'rgba(75, 0, 130, 0)');
        ctx.fillStyle = gradient;
        ctx.beginPath();
        ctx.arc(centerX, centerY, glowSize, 0, Math.PI * 2);
        ctx.fill();

        // Gem shape (diamond)
        const size = 22;
        ctx.fillStyle = '#9400D3';
        ctx.beginPath();
        ctx.moveTo(centerX, centerY - size);
        ctx.lineTo(centerX + size, centerY);
        ctx.lineTo(centerX, centerY + size);
        ctx.lineTo(centerX - size, centerY);
        ctx.closePath();
        ctx.fill();

        // Inner facets
        ctx.fillStyle = '#BA55D3';
        ctx.beginPath();
        ctx.moveTo(centerX, centerY - size + 5);
        ctx.lineTo(centerX + size - 8, centerY);
        ctx.lineTo(centerX, centerY + 5);
        ctx.lineTo(centerX - size + 8, centerY);
        ctx.closePath();
        ctx.fill();

        // Shine
        ctx.fillStyle = 'rgba(255, 255, 255, 0.6)';
        ctx.beginPath();
        ctx.moveTo(centerX - 5, centerY - size + 8);
        ctx.lineTo(centerX + 3, centerY - size + 12);
        ctx.lineTo(centerX - 2, centerY - 5);
        ctx.lineTo(centerX - 8, centerY - 8);
        ctx.closePath();
        ctx.fill();

        // Sparkles
        ctx.fillStyle = '#FFD700';
        for (let i = 0; i < 5; i++) {
            const angle = time * 1.5 + i * (Math.PI * 2 / 5);
            const dist = 35 + Math.sin(time * 3 + i) * 8;
            const sparkleX = centerX + Math.cos(angle) * dist;
            const sparkleY = centerY + Math.sin(angle) * dist;
            const sparkleSize = 2 + Math.sin(time * 4 + i) * 1;
            ctx.beginPath();
            ctx.arc(sparkleX, sparkleY, sparkleSize, 0, Math.PI * 2);
            ctx.fill();
        }
    }
}

// ============================================================================
// TUTORIAL SYSTEM
// ============================================================================
class Tutorial {
    constructor() {
        this.currentStep = 0;
        this.steps = [
            {
                title: 'Welcome to Terror Castle!',
                text: 'Trolls want to steal the shiny\nGem of Darkness!\nYour job is to STOP them!',
                icon: 'gem'
            },
            {
                title: 'Meet the Trolls',
                text: 'Green trolls walk toward the gem.\nIf they touch it, the gem loses health!\nDon\'t let them reach it!',
                icon: 'troll'
            },
            {
                title: 'Moving Your Cursor',
                text: 'Use ARROW KEYS or W-A-S-D\nto move around the castle.\nUP and DOWN change floors!',
                icon: 'arrows'
            },
            {
                title: 'Placing Traps',
                text: 'Press 1, 2, 3, or 4 to pick a trap.\nMove to where you want it.\nPress SPACE to place it!',
                icon: 'trap'
            },
            {
                title: 'Spike Platform (Press 1)',
                text: 'Sharp spikes pop up and hurt trolls!\nCosts $10 - Can be used 5 times.',
                icon: 'spike'
            },
            {
                title: 'Light Machine (Press 2)',
                text: 'Bright flashing lights!\nTrolls HATE light - it stuns them!\nCosts $25 - Never breaks!',
                icon: 'light'
            },
            {
                title: 'Slime Puddle (Press 3)',
                text: 'Gooey green slime!\nMakes trolls walk SUPER slow.\nCosts $15 - Works 10 times.',
                icon: 'slime'
            },
            {
                title: 'Loud Bell (Press 4)',
                text: 'BONG! A super loud bell!\nStuns ALL trolls nearby!\nCosts $30 - Only 3 uses!',
                icon: 'bell'
            },
            {
                title: 'You\'re Ready!',
                text: 'Defeat all the trolls to win!\nEarn coins by stopping trolls!\nGood luck, castle defender!',
                icon: 'star'
            }
        ];
    }

    handleInput(input) {
        if (input.isJustPressed('ArrowRight') || input.isJustPressed('KeyD') || input.isJustPressed('Space')) {
            if (this.currentStep < this.steps.length - 1) {
                this.currentStep++;
            } else {
                return true; // Tutorial complete
            }
        }
        if (input.isJustPressed('ArrowLeft') || input.isJustPressed('KeyA')) {
            if (this.currentStep > 0) {
                this.currentStep--;
            }
        }
        if (input.isJustPressed('Enter')) {
            return true; // Skip tutorial
        }
        return false;
    }

    reset() {
        this.currentStep = 0;
    }

    render(ctx, width, height) {
        // Background
        ctx.fillStyle = 'rgba(0, 0, 0, 0.9)';
        ctx.fillRect(0, 0, width, height);

        const step = this.steps[this.currentStep];
        const boxWidth = 550;
        const boxHeight = 320;
        const boxX = (width - boxWidth) / 2;
        const boxY = (height - boxHeight) / 2;

        // Box
        ctx.fillStyle = '#2a2a4a';
        ctx.beginPath();
        ctx.roundRect(boxX, boxY, boxWidth, boxHeight, 15);
        ctx.fill();
        ctx.strokeStyle = '#9400D3';
        ctx.lineWidth = 4;
        ctx.stroke();

        // Progress dots
        this.renderProgress(ctx, boxX, boxY - 25, boxWidth);

        // Title
        ctx.fillStyle = '#FFD700';
        ctx.font = 'bold 28px Arial';
        ctx.textAlign = 'center';
        ctx.fillText(step.title, width/2, boxY + 45);

        // Icon
        this.renderIcon(ctx, step.icon, width/2, boxY + 110);

        // Text
        ctx.fillStyle = '#fff';
        ctx.font = '18px Arial';
        const lines = step.text.split('\n');
        lines.forEach((line, i) => {
            ctx.fillText(line, width/2, boxY + 190 + i * 28);
        });

        // Navigation hints
        ctx.font = '14px Arial';
        ctx.fillStyle = '#888';
        if (this.currentStep > 0) {
            ctx.textAlign = 'left';
            ctx.fillText('< LEFT for previous', boxX + 20, boxY + boxHeight - 20);
        }
        if (this.currentStep < this.steps.length - 1) {
            ctx.textAlign = 'right';
            ctx.fillText('RIGHT or SPACE for next >', boxX + boxWidth - 20, boxY + boxHeight - 20);
        } else {
            ctx.textAlign = 'center';
            ctx.fillStyle = '#FFD700';
            ctx.font = 'bold 16px Arial';
            ctx.fillText('Press ENTER or SPACE to start!', width/2, boxY + boxHeight - 20);
        }

        // Skip hint
        ctx.fillStyle = '#666';
        ctx.font = '12px Arial';
        ctx.textAlign = 'center';
        ctx.fillText('Press ENTER to skip tutorial', width/2, height - 30);
    }

    renderProgress(ctx, x, y, width) {
        const dotSize = 10;
        const spacing = 18;
        const totalWidth = this.steps.length * (dotSize + spacing) - spacing;
        const startX = x + (width - totalWidth) / 2;

        for (let i = 0; i < this.steps.length; i++) {
            const dotX = startX + i * (dotSize + spacing);
            ctx.fillStyle = i === this.currentStep ? '#FFD700' : (i < this.currentStep ? '#9400D3' : '#444');
            ctx.beginPath();
            ctx.arc(dotX + dotSize/2, y, dotSize/2, 0, Math.PI * 2);
            ctx.fill();
        }
    }

    renderIcon(ctx, icon, x, y) {
        ctx.save();
        switch (icon) {
            case 'gem':
                // Purple gem
                ctx.fillStyle = '#9400D3';
                ctx.beginPath();
                ctx.moveTo(x, y - 25);
                ctx.lineTo(x + 25, y);
                ctx.lineTo(x, y + 25);
                ctx.lineTo(x - 25, y);
                ctx.closePath();
                ctx.fill();
                break;

            case 'troll':
                // Green troll face
                ctx.fillStyle = '#4a7c4e';
                ctx.beginPath();
                ctx.arc(x, y, 28, 0, Math.PI * 2);
                ctx.fill();
                ctx.fillStyle = '#fff';
                ctx.beginPath();
                ctx.arc(x - 10, y - 5, 8, 0, Math.PI * 2);
                ctx.arc(x + 10, y - 5, 8, 0, Math.PI * 2);
                ctx.fill();
                ctx.fillStyle = '#000';
                ctx.beginPath();
                ctx.arc(x - 8, y - 5, 4, 0, Math.PI * 2);
                ctx.arc(x + 12, y - 5, 4, 0, Math.PI * 2);
                ctx.fill();
                ctx.fillStyle = '#fff';
                ctx.fillRect(x - 10, y + 12, 7, 10);
                ctx.fillRect(x + 3, y + 12, 7, 10);
                break;

            case 'arrows':
                ctx.fillStyle = '#fff';
                ctx.font = 'bold 36px Arial';
                ctx.textAlign = 'center';
                ctx.fillText('\u2190 \u2191 \u2193 \u2192', x, y + 12);
                break;

            case 'trap':
            case 'spike':
                // Spike platform
                ctx.fillStyle = '#8B4513';
                ctx.fillRect(x - 30, y + 5, 60, 18);
                ctx.fillStyle = '#C0C0C0';
                for (let i = 0; i < 5; i++) {
                    ctx.beginPath();
                    ctx.moveTo(x - 25 + i * 13, y + 5);
                    ctx.lineTo(x - 20 + i * 13, y - 20);
                    ctx.lineTo(x - 15 + i * 13, y + 5);
                    ctx.closePath();
                    ctx.fill();
                }
                break;

            case 'light':
                // Light bulb with glow
                const gradient = ctx.createRadialGradient(x, y - 5, 0, x, y - 5, 35);
                gradient.addColorStop(0, 'rgba(255, 255, 0, 0.6)');
                gradient.addColorStop(1, 'rgba(255, 255, 0, 0)');
                ctx.fillStyle = gradient;
                ctx.beginPath();
                ctx.arc(x, y - 5, 35, 0, Math.PI * 2);
                ctx.fill();
                ctx.fillStyle = '#FFFF00';
                ctx.beginPath();
                ctx.arc(x, y - 5, 18, 0, Math.PI * 2);
                ctx.fill();
                ctx.fillStyle = '#505050';
                ctx.fillRect(x - 18, y + 15, 36, 20);
                break;

            case 'slime':
                ctx.fillStyle = '#7CFC00';
                ctx.beginPath();
                ctx.ellipse(x, y, 35, 18, 0, 0, Math.PI * 2);
                ctx.fill();
                ctx.fillStyle = 'rgba(150, 255, 150, 0.6)';
                ctx.beginPath();
                ctx.arc(x - 12, y - 5, 6, 0, Math.PI * 2);
                ctx.arc(x + 15, y, 5, 0, Math.PI * 2);
                ctx.fill();
                break;

            case 'bell':
                ctx.fillStyle = '#FFD700';
                ctx.beginPath();
                ctx.moveTo(x - 20, y - 20);
                ctx.quadraticCurveTo(x - 28, y + 15, x - 32, y + 25);
                ctx.lineTo(x + 32, y + 25);
                ctx.quadraticCurveTo(x + 28, y + 15, x + 20, y - 20);
                ctx.closePath();
                ctx.fill();
                ctx.fillStyle = '#8B4513';
                ctx.beginPath();
                ctx.arc(x, y + 18, 8, 0, Math.PI * 2);
                ctx.fill();
                break;

            case 'star':
                ctx.fillStyle = '#FFD700';
                ctx.beginPath();
                for (let i = 0; i < 5; i++) {
                    const angle = (i * 4 * Math.PI / 5) - Math.PI / 2;
                    const px = x + Math.cos(angle) * 30;
                    const py = y + Math.sin(angle) * 30;
                    if (i === 0) ctx.moveTo(px, py);
                    else ctx.lineTo(px, py);
                }
                ctx.closePath();
                ctx.fill();
                break;
        }
        ctx.restore();
    }
}

// ============================================================================
// MAIN GAME CLASS
// ============================================================================
class Game {
    constructor(canvasId) {
        this.canvas = document.getElementById(canvasId);
        this.ctx = this.canvas.getContext('2d');
        this.width = CANVAS_WIDTH;
        this.height = CANVAS_HEIGHT;

        this.input = new InputManager();
        this.tutorial = new Tutorial();

        this.state = GameStates.MENU;
        this.menuSelection = 0;

        // Game entities
        this.trolls = [];
        this.traps = [];
        this.gem = null;

        // Game state
        this.score = 0;
        this.coins = 0;
        this.trollsDefeated = 0;
        this.currentLevel = 0;
        this.currentWave = 0;
        this.trollsToSpawn = 0;
        this.spawnTimer = 0;
        this.waveDelay = 0;

        // Cursor for trap placement
        this.cursor = {
            x: this.width / 2,
            y: FLOORS[0].y + FLOORS[0].height - 40,
            floor: 1,
            speed: 350,
            selectedTrap: 0
        };

        // Setup responsive scaling
        this.setupResponsiveScaling();
        window.addEventListener('resize', () => this.setupResponsiveScaling());

        // Start game loop
        this.lastTime = performance.now();
        this.gameLoop();
    }

    setupResponsiveScaling() {
        const container = this.canvas.parentElement;
        const windowWidth = window.innerWidth;
        const windowHeight = window.innerHeight;

        // Calculate scale to fit window while maintaining aspect ratio
        const scaleX = (windowWidth - 40) / CANVAS_WIDTH;  // 40px padding
        const scaleY = (windowHeight - 40) / CANVAS_HEIGHT;
        const scale = Math.min(scaleX, scaleY, 2); // Cap at 2x to avoid too large

        // Apply scale via CSS transform
        container.style.transform = `scale(${scale})`;
        container.style.transformOrigin = 'center center';
    }

    gameLoop() {
        const currentTime = performance.now();
        const deltaTime = currentTime - this.lastTime;
        this.lastTime = currentTime;

        this.update(deltaTime);
        this.render();

        this.input.clearJustPressed();
        requestAnimationFrame(() => this.gameLoop());
    }

    update(deltaTime) {
        switch (this.state) {
            case GameStates.MENU:
                this.updateMenu();
                break;
            case GameStates.TUTORIAL:
                this.updateTutorial();
                break;
            case GameStates.PLAYING:
                this.updateGame(deltaTime);
                break;
            case GameStates.WAVE_COMPLETE:
                this.updateWaveComplete();
                break;
            case GameStates.GAME_OVER:
            case GameStates.VICTORY:
                this.updateEndScreen();
                break;
        }
    }

    updateMenu() {
        if (this.input.isJustPressed('ArrowUp') || this.input.isJustPressed('KeyW')) {
            this.menuSelection = Math.max(0, this.menuSelection - 1);
        }
        if (this.input.isJustPressed('ArrowDown') || this.input.isJustPressed('KeyS')) {
            this.menuSelection = Math.min(1, this.menuSelection + 1);
        }
        if (this.input.isActionPressed()) {
            if (this.menuSelection === 0) {
                this.state = GameStates.TUTORIAL;
                this.tutorial.reset();
            } else {
                this.startNewGame();
            }
        }
    }

    updateTutorial() {
        if (this.tutorial.handleInput(this.input)) {
            this.startNewGame();
        }
    }

    startNewGame() {
        this.state = GameStates.PLAYING;
        this.score = 0;
        this.trollsDefeated = 0;
        this.currentLevel = 0;
        this.currentWave = 0;
        this.trolls = [];
        this.traps = [];

        // Setup gem on top floor
        const topFloor = FLOORS[2];
        this.gem = new Gem(this.width/2 - 25, topFloor.y + 40);

        // Reset cursor
        this.cursor.x = this.width / 2;
        this.cursor.floor = 1;
        this.cursor.y = FLOORS[0].y + FLOORS[0].height - 40;
        this.cursor.selectedTrap = 0;

        // Start first level
        this.startLevel();
    }

    startLevel() {
        const level = LEVELS[this.currentLevel];
        this.coins += level.startCoins;
        this.currentWave = 0;
        this.startWave();
    }

    startWave() {
        const level = LEVELS[this.currentLevel];
        const wave = level.waves[this.currentWave];
        this.trollsToSpawn = wave.trollCount;
        this.spawnTimer = wave.spawnDelay; // Spawn first troll after delay
    }

    updateGame(deltaTime) {
        // Update cursor
        this.updateCursor(deltaTime);

        // Update trap selection
        const trapSelection = this.input.getTrapSelection();
        if (trapSelection !== null) {
            this.cursor.selectedTrap = trapSelection;
        }

        // Handle trap placement
        if (this.input.isActionPressed()) {
            this.placeTrap();
        }

        // Spawn trolls
        this.updateSpawning(deltaTime);

        // Update all entities
        this.trolls.forEach(troll => troll.update(deltaTime));
        this.traps.forEach(trap => trap.update(deltaTime));

        // Check collisions
        this.checkCollisions();

        // Remove inactive entities
        this.trolls = this.trolls.filter(t => t.active);
        this.traps = this.traps.filter(t => t.active);

        // Check win/lose
        this.checkGameState();
    }

    updateCursor(deltaTime) {
        const movement = this.input.getMovement();
        const speed = this.cursor.speed * (deltaTime / 1000);

        if (movement.left) this.cursor.x -= speed;
        if (movement.right) this.cursor.x += speed;

        // Change floors with up/down (with delay to prevent rapid switching)
        if (this.input.isJustPressed('ArrowUp') || this.input.isJustPressed('KeyW')) {
            this.moveCursorToFloor(this.cursor.floor + 1);
        }
        if (this.input.isJustPressed('ArrowDown') || this.input.isJustPressed('KeyS')) {
            this.moveCursorToFloor(this.cursor.floor - 1);
        }

        // Clamp to screen bounds
        this.cursor.x = Math.max(50, Math.min(this.width - 50, this.cursor.x));
    }

    moveCursorToFloor(newFloor) {
        if (newFloor >= 1 && newFloor <= 3) {
            this.cursor.floor = newFloor;
            const floor = FLOORS[newFloor - 1];
            this.cursor.y = floor.y + floor.height - 40;
        }
    }

    placeTrap() {
        const trapType = TRAP_TYPES[this.cursor.selectedTrap];

        // Check if can afford
        if (this.coins < trapType.cost) return;

        // Check for overlap with existing traps
        const testX = this.cursor.x - 35;
        for (const trap of this.traps) {
            if (trap.floor !== this.cursor.floor) continue;
            if (Math.abs(trap.x - testX) < 60) return; // Too close
        }

        // Create trap
        let trap;
        const x = this.cursor.x - 35;
        const y = this.cursor.y - 10;
        const floor = this.cursor.floor;

        switch (this.cursor.selectedTrap) {
            case 0: trap = new SpikeTrap(x, y, floor); break;
            case 1: trap = new LightMachine(x, y - 25, floor); break;
            case 2: trap = new SlimePuddle(x, y + 5, floor); break;
            case 3: trap = new BellTrap(x, y - 30, floor); break;
        }

        this.traps.push(trap);
        this.coins -= trapType.cost;
    }

    updateSpawning(deltaTime) {
        if (this.trollsToSpawn <= 0) return;

        this.spawnTimer -= deltaTime;
        if (this.spawnTimer <= 0) {
            this.spawnTroll();
            this.trollsToSpawn--;

            const wave = LEVELS[this.currentLevel].waves[this.currentWave];
            this.spawnTimer = wave.spawnDelay;
        }
    }

    spawnTroll() {
        const wave = LEVELS[this.currentLevel].waves[this.currentWave];

        // All trolls start on floor 1 and climb up to reach the gem
        const floor = FLOORS[0]; // Ground floor

        // Spawn from the left side
        const x = -50;
        const y = floor.y + floor.height - 60;

        const troll = new Troll(x, y, 1, wave.trollSpeed, wave.trollHealth);
        // Direction is set by updateDirection() in constructor

        this.trolls.push(troll);
    }

    checkCollisions() {
        this.trolls.forEach(troll => {
            if (!troll.active || troll.state === 'dying') return;

            // Check trap collisions
            this.traps.forEach(trap => {
                if (!trap.active || trap.floor !== troll.floor) return;

                // Bell trap has area effect
                if (trap instanceof BellTrap) {
                    // Bell activates on proximity
                    const dx = (troll.x + troll.width/2) - (trap.x + trap.width/2);
                    const dy = (troll.y + troll.height/2) - (trap.y + trap.height/2);
                    const dist = Math.sqrt(dx*dx + dy*dy);
                    if (dist < 80 && trap.canActivate()) {
                        trap.activateArea(this.trolls);
                    }
                } else {
                    // Regular collision
                    if (this.checkAABB(troll.getBounds(), trap.getBounds())) {
                        if (trap.canActivate()) {
                            trap.activate(troll);
                        }
                    }
                }
            });

            // Check if troll reached the gem (only possible on floor 3)
            if (troll.floor === 3) {
                if (this.checkAABB(troll.getBounds(), this.gem.getBounds())) {
                    this.gem.health -= 15;
                    troll.active = false;
                    // Immediately check for game over
                    if (this.gem.health <= 0) {
                        this.state = GameStates.GAME_OVER;
                    }
                }
            }
        });

        // Award points for trolls killed by traps (check separately to avoid double-counting)
        this.trolls.forEach(troll => {
            if (troll.state === 'dying' && !troll.pointsAwarded) {
                this.score += 100;
                this.coins += 15;  // More coins per kill!
                this.trollsDefeated++;
                troll.pointsAwarded = true; // Mark so we don't award again
            }
        });
    }

    checkAABB(a, b) {
        return a.left < b.right && a.right > b.left && a.top < b.bottom && a.bottom > b.top;
    }

    checkGameState() {
        // Check lose condition
        if (this.gem.health <= 0) {
            this.state = GameStates.GAME_OVER;
            return;
        }

        // Check wave complete
        if (this.trollsToSpawn === 0 && this.trolls.length === 0) {
            const level = LEVELS[this.currentLevel];

            // Award wave completion bonus!
            const waveBonus = level.waveBonus || 20;
            this.coins += waveBonus;
            this.waveBonusAwarded = waveBonus; // Store for display

            this.currentWave++;

            if (this.currentWave >= level.waves.length) {
                // Level complete
                this.currentLevel++;
                if (this.currentLevel >= LEVELS.length) {
                    // Game complete!
                    this.state = GameStates.VICTORY;
                } else {
                    this.state = GameStates.WAVE_COMPLETE;
                    this.waveDelay = 0;
                }
            } else {
                // Next wave
                this.state = GameStates.WAVE_COMPLETE;
                this.waveDelay = 0;
            }
        }
    }

    updateWaveComplete() {
        if (this.input.isActionPressed()) {
            this.state = GameStates.PLAYING;

            // Check if starting new level
            const level = LEVELS[this.currentLevel];
            if (this.currentWave === 0) {
                this.startLevel();
            } else {
                this.startWave();
            }
        }
    }

    updateEndScreen() {
        if (this.input.isActionPressed()) {
            this.state = GameStates.MENU;
            this.menuSelection = 0;
        }
    }

    // ========================================================================
    // RENDERING
    // ========================================================================
    render() {
        // Clear canvas
        this.ctx.fillStyle = '#1a1a2e';
        this.ctx.fillRect(0, 0, this.width, this.height);

        switch (this.state) {
            case GameStates.MENU:
                this.renderMenu();
                break;
            case GameStates.TUTORIAL:
                this.tutorial.render(this.ctx, this.width, this.height);
                break;
            case GameStates.PLAYING:
            case GameStates.WAVE_COMPLETE:
                this.renderGame();
                if (this.state === GameStates.WAVE_COMPLETE) {
                    this.renderWaveComplete();
                }
                break;
            case GameStates.GAME_OVER:
                this.renderGame();
                this.renderGameOver();
                break;
            case GameStates.VICTORY:
                this.renderGame();
                this.renderVictory();
                break;
        }
    }

    renderMenu() {
        // Background castle silhouette
        this.ctx.fillStyle = '#2a2a4a';
        this.ctx.fillRect(100, 150, this.width - 200, 350);

        // Battlements
        for (let x = 100; x < this.width - 100; x += 60) {
            this.ctx.fillRect(x, 170, 40, 30);
        }

        // Title glow
        this.ctx.shadowColor = '#9400D3';
        this.ctx.shadowBlur = 30;

        // Title
        this.ctx.fillStyle = '#9400D3';
        this.ctx.font = 'bold 70px Arial';
        this.ctx.textAlign = 'center';
        this.ctx.fillText('TERROR CASTLE', this.width/2, 120);

        this.ctx.shadowBlur = 10;
        this.ctx.fillStyle = '#BA55D3';
        this.ctx.font = '26px Arial';
        this.ctx.fillText('Defend the Gem of Darkness!', this.width/2, 160);

        this.ctx.shadowBlur = 0;

        // Menu options
        const options = ['Play with Tutorial', 'Quick Start'];
        options.forEach((option, i) => {
            const y = 320 + i * 60;
            const isSelected = i === this.menuSelection;

            if (isSelected) {
                this.ctx.fillStyle = 'rgba(148, 0, 211, 0.3)';
                this.ctx.beginPath();
                this.ctx.roundRect(this.width/2 - 150, y - 25, 300, 50, 10);
                this.ctx.fill();

                this.ctx.fillStyle = '#FFD700';
                this.ctx.font = 'bold 28px Arial';
            } else {
                this.ctx.fillStyle = '#fff';
                this.ctx.font = '26px Arial';
            }

            this.ctx.textAlign = 'center';
            this.ctx.fillText(option, this.width/2, y + 8);

            if (isSelected) {
                this.ctx.fillText('>', this.width/2 - 130, y + 8);
                this.ctx.fillText('<', this.width/2 + 130, y + 8);
            }
        });

        // Controls hint
        this.ctx.fillStyle = '#888';
        this.ctx.font = '16px Arial';
        this.ctx.fillText('Use UP/DOWN arrows and SPACE to select', this.width/2, this.height - 50);

        // Credits
        this.ctx.fillStyle = '#666';
        this.ctx.font = '14px Arial';
        this.ctx.fillText('A game for Leo and Bowman', this.width/2, this.height - 25);
    }

    renderGame() {
        // Draw castle background
        this.renderCastle();

        // Draw gem
        this.gem.render(this.ctx);

        // Draw traps
        this.traps.forEach(trap => trap.render(this.ctx));

        // Draw trolls
        this.trolls.forEach(troll => troll.render(this.ctx));

        // Draw cursor
        this.renderCursor();

        // Draw HUD
        this.renderHUD();
    }

    renderCastle() {
        // Night sky gradient
        const skyGradient = this.ctx.createLinearGradient(0, 0, 0, this.height);
        skyGradient.addColorStop(0, '#0a0a1a');
        skyGradient.addColorStop(1, '#1a1a3e');
        this.ctx.fillStyle = skyGradient;
        this.ctx.fillRect(0, 0, this.width, this.height);

        // Stars
        this.ctx.fillStyle = '#fff';
        for (let i = 0; i < 50; i++) {
            const x = (i * 137) % this.width;
            const y = (i * 89) % 100 + 10;
            const size = ((i * 23) % 3) + 1;
            this.ctx.beginPath();
            this.ctx.arc(x, y, size, 0, Math.PI * 2);
            this.ctx.fill();
        }

        // Castle main wall - stops above the trap UI area
        const castleBottom = 490; // Leave room for trap UI
        this.ctx.fillStyle = '#3a3a4a';
        this.ctx.fillRect(30, 60, this.width - 60, castleBottom - 60);

        // Castle outline
        this.ctx.strokeStyle = '#2a2a3a';
        this.ctx.lineWidth = 4;
        this.ctx.strokeRect(30, 60, this.width - 60, castleBottom - 60);

        // Battlements
        this.ctx.fillStyle = '#3a3a4a';
        for (let x = 30; x < this.width - 30; x += 50) {
            this.ctx.fillRect(x, 30, 35, 30);
        }

        // Render floors
        FLOORS.forEach((floor, i) => {
            // Floor surface
            this.ctx.fillStyle = floor.color;
            this.ctx.fillRect(40, floor.y, this.width - 80, floor.height);

            // Floor border
            this.ctx.strokeStyle = '#4a4a5a';
            this.ctx.lineWidth = 3;
            this.ctx.strokeRect(40, floor.y, this.width - 80, floor.height);

            // Floor label
            this.ctx.fillStyle = 'rgba(255, 255, 255, 0.5)';
            this.ctx.font = 'bold 14px Arial';
            this.ctx.textAlign = 'left';
            this.ctx.fillText(floor.name, 55, floor.y + 22);

            // Decorative torches
            this.renderTorch(60, floor.y + floor.height - 40);
            this.renderTorch(this.width - 80, floor.y + floor.height - 40);
        });

        // Stairs between floors
        this.renderStairs(this.width - 120, FLOORS[0].y, FLOORS[1].y + FLOORS[1].height);
        this.renderStairs(100, FLOORS[1].y, FLOORS[2].y + FLOORS[2].height);
    }

    renderTorch(x, y) {
        // Torch holder
        this.ctx.fillStyle = '#654321';
        this.ctx.fillRect(x - 4, y, 8, 20);

        // Flame glow
        const time = Date.now() / 200;
        const flicker = Math.sin(time + x) * 3;

        const gradient = this.ctx.createRadialGradient(x, y - 5 + flicker, 0, x, y - 5 + flicker, 25);
        gradient.addColorStop(0, 'rgba(255, 150, 0, 0.8)');
        gradient.addColorStop(0.5, 'rgba(255, 100, 0, 0.3)');
        gradient.addColorStop(1, 'rgba(255, 50, 0, 0)');
        this.ctx.fillStyle = gradient;
        this.ctx.beginPath();
        this.ctx.arc(x, y - 5 + flicker, 25, 0, Math.PI * 2);
        this.ctx.fill();

        // Flame
        this.ctx.fillStyle = '#ff6600';
        this.ctx.beginPath();
        this.ctx.moveTo(x - 6, y);
        this.ctx.quadraticCurveTo(x - 8, y - 15 + flicker, x, y - 20 + flicker);
        this.ctx.quadraticCurveTo(x + 8, y - 15 + flicker, x + 6, y);
        this.ctx.closePath();
        this.ctx.fill();

        // Inner flame
        this.ctx.fillStyle = '#ffcc00';
        this.ctx.beginPath();
        this.ctx.moveTo(x - 3, y);
        this.ctx.quadraticCurveTo(x - 4, y - 10 + flicker, x, y - 14 + flicker);
        this.ctx.quadraticCurveTo(x + 4, y - 10 + flicker, x + 3, y);
        this.ctx.closePath();
        this.ctx.fill();
    }

    renderStairs(x, bottomY, topY) {
        const steps = 5;
        const stepHeight = (bottomY - topY) / steps;
        const stepWidth = 50;

        this.ctx.fillStyle = '#4a4a5a';
        for (let i = 0; i < steps; i++) {
            const stepY = topY + i * stepHeight;
            this.ctx.fillRect(x - stepWidth/2, stepY, stepWidth, stepHeight + 2);
        }

        // Stair outline
        this.ctx.strokeStyle = '#3a3a4a';
        this.ctx.lineWidth = 2;
        for (let i = 0; i < steps; i++) {
            const stepY = topY + i * stepHeight;
            this.ctx.strokeRect(x - stepWidth/2, stepY, stepWidth, stepHeight + 2);
        }
    }

    renderCursor() {
        const trapType = TRAP_TYPES[this.cursor.selectedTrap];
        const canAfford = this.coins >= trapType.cost;

        // Cursor box
        this.ctx.strokeStyle = canAfford ? '#00ff00' : '#ff0000';
        this.ctx.lineWidth = 3;
        this.ctx.setLineDash([8, 4]);
        this.ctx.strokeRect(this.cursor.x - 40, this.cursor.y - 25, 80, 50);
        this.ctx.setLineDash([]);

        // Semi-transparent trap preview
        if (canAfford) {
            this.ctx.globalAlpha = 0.5;
            // Draw preview based on trap type
            this.ctx.fillStyle = trapType.color;
            this.ctx.fillRect(this.cursor.x - 35, this.cursor.y - 10, 70, 20);
            this.ctx.globalAlpha = 1;
        }

        // Floor indicator arrow
        this.ctx.fillStyle = '#fff';
        this.ctx.beginPath();
        this.ctx.moveTo(30, this.cursor.y);
        this.ctx.lineTo(40, this.cursor.y - 8);
        this.ctx.lineTo(40, this.cursor.y + 8);
        this.ctx.closePath();
        this.ctx.fill();
    }

    renderHUD() {
        // Top bar background
        this.ctx.fillStyle = 'rgba(0, 0, 0, 0.7)';
        this.ctx.fillRect(0, 0, this.width, 55);

        // Gem health
        this.renderGemHealth();

        // Coins
        this.renderCoins();

        // Score
        this.ctx.fillStyle = '#fff';
        this.ctx.font = 'bold 20px Arial';
        this.ctx.textAlign = 'right';
        this.ctx.fillText(`Score: ${this.score}`, this.width - 20, 35);

        // Wave info
        const level = LEVELS[this.currentLevel];
        this.ctx.font = '16px Arial';
        this.ctx.fillText(`Level ${this.currentLevel + 1} - Wave ${this.currentWave + 1}/${level.waves.length}`, this.width - 20, 18);

        // Trap selector
        this.renderTrapSelector();
    }

    renderGemHealth() {
        const x = 20;
        const y = 18;
        const width = 200;
        const height = 22;

        // Label with gem icon
        this.ctx.fillStyle = '#9400D3';
        this.ctx.beginPath();
        this.ctx.moveTo(x + 8, y - 5);
        this.ctx.lineTo(x + 16, y + 3);
        this.ctx.lineTo(x + 8, y + 11);
        this.ctx.lineTo(x, y + 3);
        this.ctx.closePath();
        this.ctx.fill();

        // Health bar background
        this.ctx.fillStyle = '#333';
        this.ctx.beginPath();
        this.ctx.roundRect(x + 25, y - 5, width, height, 4);
        this.ctx.fill();

        // Health bar fill
        const healthPercent = this.gem.health / this.gem.maxHealth;
        let barColor;
        if (healthPercent > 0.5) {
            barColor = '#9400D3';
        } else if (healthPercent > 0.25) {
            barColor = '#ff9800';
        } else {
            barColor = '#f44336';
        }

        this.ctx.fillStyle = barColor;
        this.ctx.beginPath();
        this.ctx.roundRect(x + 25, y - 5, width * healthPercent, height, 4);
        this.ctx.fill();

        // Health text
        this.ctx.fillStyle = '#fff';
        this.ctx.font = 'bold 14px Arial';
        this.ctx.textAlign = 'center';
        this.ctx.fillText(`${this.gem.health}/${this.gem.maxHealth}`, x + 25 + width/2, y + 10);
    }

    renderCoins() {
        const x = 260;
        const y = 28;

        // Coin icon
        this.ctx.fillStyle = '#FFD700';
        this.ctx.beginPath();
        this.ctx.arc(x, y, 14, 0, Math.PI * 2);
        this.ctx.fill();
        this.ctx.fillStyle = '#DAA520';
        this.ctx.font = 'bold 16px Arial';
        this.ctx.textAlign = 'center';
        this.ctx.fillText('$', x, y + 6);

        // Coin count
        this.ctx.fillStyle = '#fff';
        this.ctx.font = 'bold 22px Arial';
        this.ctx.textAlign = 'left';
        this.ctx.fillText(this.coins.toString(), x + 22, y + 7);
    }

    renderTrapSelector() {
        const boxSize = 55;
        const spacing = 12;
        const totalWidth = 4 * boxSize + 3 * spacing + 40; // 4 traps + padding
        const startX = (this.width - totalWidth) / 2 + 20; // Center horizontally
        const y = this.height - 75;

        // Background - centered
        this.ctx.fillStyle = 'rgba(0, 0, 0, 0.8)';
        this.ctx.beginPath();
        this.ctx.roundRect((this.width - totalWidth) / 2, this.height - 95, totalWidth, 90, 10);
        this.ctx.fill();

        // Title
        this.ctx.fillStyle = '#fff';
        this.ctx.font = 'bold 12px Arial';
        this.ctx.textAlign = 'left';
        this.ctx.fillText('TRAPS (Press 1-4):', startX, y - 8);

        TRAP_TYPES.forEach((trap, i) => {
            const x = startX + i * (boxSize + spacing);
            const isSelected = i === this.cursor.selectedTrap;
            const canAfford = this.coins >= trap.cost;

            // Box background
            this.ctx.fillStyle = isSelected ? 'rgba(0, 255, 0, 0.2)' : 'rgba(50, 50, 50, 0.8)';
            this.ctx.beginPath();
            this.ctx.roundRect(x, y, boxSize, boxSize, 6);
            this.ctx.fill();

            // Border
            this.ctx.strokeStyle = isSelected ? '#00ff00' : (canAfford ? '#666' : '#ff4444');
            this.ctx.lineWidth = isSelected ? 3 : 1;
            this.ctx.stroke();

            // Trap name
            this.ctx.fillStyle = canAfford ? '#fff' : '#666';
            this.ctx.font = '10px Arial';
            this.ctx.textAlign = 'center';
            this.ctx.fillText(trap.name, x + boxSize/2, y + 22);

            // Mini icon
            this.renderMiniTrapIcon(x + boxSize/2, y + 35, i);

            // Cost
            this.ctx.fillStyle = canAfford ? '#FFD700' : '#ff6666';
            this.ctx.font = 'bold 11px Arial';
            this.ctx.fillText(`$${trap.cost}`, x + boxSize/2, y + boxSize - 5);

            // Key number
            this.ctx.fillStyle = '#aaa';
            this.ctx.font = '10px Arial';
            this.ctx.textAlign = 'left';
            this.ctx.fillText(`[${i + 1}]`, x + 4, y + 12);
        });

        // Selected trap description - centered below the title
        const selectedTrap = TRAP_TYPES[this.cursor.selectedTrap];
        this.ctx.fillStyle = '#aaa';
        this.ctx.font = '12px Arial';
        this.ctx.textAlign = 'center';
        this.ctx.fillText(selectedTrap.description, this.width / 2, this.height - 5);
    }

    renderMiniTrapIcon(x, y, trapIndex) {
        this.ctx.save();
        switch (trapIndex) {
            case 0: // Spike
                this.ctx.fillStyle = '#C0C0C0';
                for (let i = 0; i < 3; i++) {
                    this.ctx.beginPath();
                    this.ctx.moveTo(x - 10 + i * 10, y + 5);
                    this.ctx.lineTo(x - 5 + i * 10, y - 8);
                    this.ctx.lineTo(x + i * 10, y + 5);
                    this.ctx.closePath();
                    this.ctx.fill();
                }
                break;
            case 1: // Light
                this.ctx.fillStyle = '#FFFF00';
                this.ctx.beginPath();
                this.ctx.arc(x, y - 2, 8, 0, Math.PI * 2);
                this.ctx.fill();
                this.ctx.fillStyle = '#505050';
                this.ctx.fillRect(x - 6, y + 6, 12, 6);
                break;
            case 2: // Slime
                this.ctx.fillStyle = '#7CFC00';
                this.ctx.beginPath();
                this.ctx.ellipse(x, y, 12, 6, 0, 0, Math.PI * 2);
                this.ctx.fill();
                break;
            case 3: // Bell
                this.ctx.fillStyle = '#FFD700';
                this.ctx.beginPath();
                this.ctx.moveTo(x - 8, y - 8);
                this.ctx.quadraticCurveTo(x - 12, y + 5, x - 14, y + 8);
                this.ctx.lineTo(x + 14, y + 8);
                this.ctx.quadraticCurveTo(x + 12, y + 5, x + 8, y - 8);
                this.ctx.closePath();
                this.ctx.fill();
                break;
        }
        this.ctx.restore();
    }

    renderWaveComplete() {
        // Semi-transparent overlay
        this.ctx.fillStyle = 'rgba(0, 0, 0, 0.7)';
        this.ctx.fillRect(0, 0, this.width, this.height);

        const isNewLevel = this.currentWave === 0 && this.currentLevel > 0;
        const level = LEVELS[this.currentLevel];

        // Box
        this.ctx.fillStyle = '#2a2a4a';
        this.ctx.beginPath();
        this.ctx.roundRect(this.width/2 - 200, this.height/2 - 100, 400, 200, 15);
        this.ctx.fill();
        this.ctx.strokeStyle = '#9400D3';
        this.ctx.lineWidth = 4;
        this.ctx.stroke();

        // Title
        this.ctx.fillStyle = '#FFD700';
        this.ctx.font = 'bold 36px Arial';
        this.ctx.textAlign = 'center';
        this.ctx.fillText(isNewLevel ? 'Level Complete!' : 'Wave Complete!', this.width/2, this.height/2 - 40);

        // Next level info
        if (isNewLevel) {
            this.ctx.fillStyle = '#fff';
            this.ctx.font = '20px Arial';
            this.ctx.fillText(`Next: ${level.name}`, this.width/2, this.height/2 + 10);
            this.ctx.fillStyle = '#FFD700';
            this.ctx.fillText(`+$${level.startCoins} coins!`, this.width/2, this.height/2 + 40);
        }

        // Continue prompt
        this.ctx.fillStyle = '#aaa';
        this.ctx.font = '18px Arial';
        this.ctx.fillText('Press SPACE to continue', this.width/2, this.height/2 + 75);
    }

    renderGameOver() {
        this.ctx.fillStyle = 'rgba(0, 0, 0, 0.85)';
        this.ctx.fillRect(0, 0, this.width, this.height);

        // Title
        this.ctx.fillStyle = '#DC143C';
        this.ctx.font = 'bold 60px Arial';
        this.ctx.textAlign = 'center';
        this.ctx.fillText('GAME OVER', this.width/2, 180);

        // Message
        this.ctx.fillStyle = '#fff';
        this.ctx.font = '24px Arial';
        this.ctx.fillText('The trolls stole the Gem of Darkness!', this.width/2, 240);

        // Stats
        this.ctx.font = '20px Arial';
        this.ctx.fillText(`Final Score: ${this.score}`, this.width/2, 320);
        this.ctx.fillText(`Trolls Defeated: ${this.trollsDefeated}`, this.width/2, 355);
        this.ctx.fillText(`Level Reached: ${this.currentLevel + 1}`, this.width/2, 390);

        // Retry
        this.ctx.fillStyle = '#FFD700';
        this.ctx.font = 'bold 24px Arial';
        this.ctx.fillText('Press SPACE to try again!', this.width/2, 480);
    }

    renderVictory() {
        this.ctx.fillStyle = 'rgba(0, 0, 0, 0.85)';
        this.ctx.fillRect(0, 0, this.width, this.height);

        // Title with glow
        this.ctx.shadowColor = '#FFD700';
        this.ctx.shadowBlur = 30;
        this.ctx.fillStyle = '#FFD700';
        this.ctx.font = 'bold 70px Arial';
        this.ctx.textAlign = 'center';
        this.ctx.fillText('VICTORY!', this.width/2, 160);
        this.ctx.shadowBlur = 0;

        // Message
        this.ctx.fillStyle = '#fff';
        this.ctx.font = '26px Arial';
        this.ctx.fillText('You protected the Gem of Darkness!', this.width/2, 220);

        // Stats
        this.ctx.font = '22px Arial';
        this.ctx.fillText(`Final Score: ${this.score}`, this.width/2, 300);
        this.ctx.fillText(`Trolls Defeated: ${this.trollsDefeated}`, this.width/2, 340);

        // Stars based on performance
        this.renderVictoryStars();

        // Play again
        this.ctx.fillStyle = '#FFD700';
        this.ctx.font = 'bold 24px Arial';
        this.ctx.fillText('Press SPACE to play again!', this.width/2, 500);

        // Congratulations
        this.ctx.fillStyle = '#9400D3';
        this.ctx.font = 'bold 20px Arial';
        this.ctx.fillText('Great job, Leo and Bowman!', this.width/2, 540);
    }

    renderVictoryStars() {
        const stars = this.score > 3000 ? 3 : (this.score > 1500 ? 2 : 1);
        const starSize = 35;
        const spacing = 80;
        const startX = this.width/2 - (stars - 1) * spacing / 2;
        const y = 420;

        this.ctx.fillStyle = '#FFD700';
        for (let i = 0; i < stars; i++) {
            const x = startX + i * spacing;
            this.ctx.beginPath();
            for (let j = 0; j < 5; j++) {
                const angle = (j * 4 * Math.PI / 5) - Math.PI / 2;
                const px = x + Math.cos(angle) * starSize;
                const py = y + Math.sin(angle) * starSize;
                if (j === 0) this.ctx.moveTo(px, py);
                else this.ctx.lineTo(px, py);
            }
            this.ctx.closePath();
            this.ctx.fill();
        }
    }
}

// ============================================================================
// START THE GAME!
// ============================================================================
window.addEventListener('DOMContentLoaded', () => {
    new Game('gameCanvas');
});
