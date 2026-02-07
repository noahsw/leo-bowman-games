import { InputManager } from './src/input.js?v=2';
import { Renderer } from './src/renderer.js?v=2';
import { PhysicsEngine } from './src/physics.js?v=2';
import { Player, Platform } from './src/entities.js?v=2';
import { LevelGenerator } from './src/level-gen.js?v=2';
import { SaveManager } from './src/storage.js?v=2';

// Main Game Entry Point
class Game {
    constructor() {
        this.canvas = document.getElementById('gameCanvas');
        this.ctx = this.canvas.getContext('2d');
        this.lastTime = 0;
        
        // Game State
        this.isRunning = false;
        this.currentLevel = 1;
        this.score = 0;
        this.lives = 3;
        this.selectedCharacter = null;
        
        // Components
        this.input = new InputManager();
        this.renderer = new Renderer(this.ctx, this.canvas.width, this.canvas.height);
        this.physics = new PhysicsEngine();
        this.levelGen = new LevelGenerator();
        this.storage = new SaveManager();
        
        // Game World
        this.camera = { x: 0, y: 0 };
        this.entities = [];
        this.player = null;
        
        // Bind methods
        this.loop = this.loop.bind(this);
        
        // UI Elements
        this.menuOverlay = document.getElementById('menu-overlay');
        this.startBtn = document.getElementById('start-btn');
        this.continueBtn = document.getElementById('continue-btn');
        
        this.charSelectOverlay = document.getElementById('charselect-overlay');
        this.gameOverOverlay = document.getElementById('gameover-overlay');
        this.newGameBtn = document.getElementById('newgame-btn');

        this.setupMenu();
    }

    setupMenu() {
        const savedData = this.storage.load();

        if (savedData) {
            this.continueBtn.classList.remove('hidden');
            this.continueBtn.textContent = `Continue (Level ${savedData.maxLevel})`;

            this.continueBtn.addEventListener('click', () => {
                this.currentLevel = savedData.maxLevel;
                this.score = savedData.highScore;
                this.lives = 3;
                this.startGame();
            });
        }

        this.startBtn.addEventListener('click', () => {
            this.currentLevel = 1;
            this.score = 0;
            this.lives = 3;
            this.startGame();
        });

        this.newGameBtn.addEventListener('click', () => {
            this.showCharacterSelect();
        });

        // Character select cards
        document.querySelectorAll('.char-card').forEach(card => {
            card.addEventListener('click', () => {
                this.selectedCharacter = card.dataset.character;
                this.currentLevel = 1;
                this.score = 0;
                this.lives = 3;
                this.startGame();
            });
        });

        // Pause handling
        window.addEventListener('keydown', (e) => {
             if (e.code === 'Escape' || e.code === 'KeyP') {
                 this.togglePause();
             }
        });
    }

    showCharacterSelect() {
        this.menuOverlay.classList.add('hidden');
        this.gameOverOverlay.classList.add('hidden');
        this.charSelectOverlay.classList.remove('hidden');
    }

    startGame() {
        this.menuOverlay.classList.add('hidden');
        this.gameOverOverlay.classList.add('hidden');
        this.charSelectOverlay.classList.add('hidden');
        this.loadLevel(this.currentLevel);
        this.start();
    }

    togglePause() {
        if (!this.isRunning) {
            // Resume
            this.menuOverlay.classList.add('hidden');
            this.start();
        } else {
            // Pause
            this.isRunning = false;
            this.menuOverlay.classList.remove('hidden');
            // Show simple pause text or just reuse menu? 
            // For MVP, just reusing menu overlay but maybe change title?
            // Or just pause loop.
        }
    }

    loadLevel(levelNum) {
        const levelData = this.levelGen.generate(levelNum);
        this.entities = levelData.entities;
        
        // Setup Player
        this.player = new Player(levelData.playerStart.x, levelData.playerStart.y, this.selectedCharacter);
        this.entities.push(this.player);
        
        // Reset Camera
        this.camera.x = 0;
        
        // Update UI
        this.updateHUD();
        
        console.log(`Loaded Level ${levelNum}`);
    }
    
    updateHUD() {
        document.getElementById('level-display').textContent = `Level: ${this.currentLevel}`;
        document.getElementById('score-display').textContent = `Score: ${this.score}`;
        document.getElementById('lives-display').textContent = `Lives: ${this.lives}`;
    }

    start() {
        if (this.isRunning) return;
        this.isRunning = true;
        this.lastTime = performance.now();
        requestAnimationFrame(this.loop);
        console.log('Game Started');
    }

    loop(timestamp) {
        if (!this.isRunning) return;

        const dt = (timestamp - this.lastTime) / 1000;
        this.lastTime = timestamp;

        this.update(dt);
        this.draw();

        requestAnimationFrame(this.loop);
    }

    update(dt) {
        // Cap dt to prevent huge jumps if tab is inactive
        const safeDt = Math.min(dt, 0.1);
        
        // Handle Input
        if (this.player && !this.player.isDead) {
            this.input.handlePlayerInput(this.player);
            
            if (this.input.isPressed('ArrowUp') || this.input.isPressed('Space')) {
                this.physics.jump(this.player);
            }
        }
        
        // Physics Update
        if (this.player) {
            this.physics.update(safeDt, this.player, this.entities);
            
            // Check Triggers (Win/Death)
            const event = this.physics.checkTriggers(this.player, this.entities);
            if (event) {
                if (event.type === 'level_complete') {
                    console.log('Level Complete!');
                    
                    // Save Progress
                    this.storage.save(this.currentLevel + 1, this.score);
                    
                    this.currentLevel++;
                    this.loadLevel(this.currentLevel);
                    return;
                } else if (event.type === 'player_death') {
                    console.log('Player Died!');
                    this.player.isDead = true;
                    this.lives--;
                    this.updateHUD();

                    if (this.lives <= 0) {
                        this.isRunning = false;
                        this.gameOverOverlay.classList.remove('hidden');
                        return;
                    }

                    this.loadLevel(this.currentLevel);
                    return;
                } else if (event.type === 'star_collected') {
                    this.score += 100;
                    this.updateHUD();
                }
            }
        }
        
        // Camera Follow
        if (this.player) {
            this.camera.x = this.player.x - 300; // Keep player somewhat left-center
            if (this.camera.x < 0) this.camera.x = 0;
        }

        // Update all entities (animations/logic)
        this.entities.forEach(entity => entity.update(safeDt));
        
        // Remove entities marked for removal
        this.entities = this.entities.filter(e => !e.toBeRemoved);
    }

    draw() {
        this.renderer.clear();
        
        // Draw all entities
        this.entities.forEach(entity => this.renderer.drawEntity(entity, this.camera));
    }
}

// Initialize game when DOM is loaded
window.addEventListener('DOMContentLoaded', () => {
    window.game = new Game(); // Expose to window for debugging
});
