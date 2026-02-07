export class InputManager {
    constructor() {
        this.keys = {};
        this.downKeys = {}; // Keys currently held down

        window.addEventListener('keydown', (e) => {
            if (e.code === 'Space' || e.code.startsWith('Arrow')) {
                e.preventDefault();
            }
            this.keys[e.code] = true;
            this.downKeys[e.code] = true;
        });

        window.addEventListener('keyup', (e) => {
            this.keys[e.code] = false;
            this.downKeys[e.code] = false;
        });
    }

    isDown(code) {
        return !!this.downKeys[code];
    }

    isPressed(code) {
        // Simple pressed check (can be enhanced for single-frame triggers)
        return !!this.downKeys[code];
    }
    
    handlePlayerInput(player) {
        player.vx = 0;
        
        if (this.isDown('ArrowLeft')) {
            player.vx = -player.speed;
        }
        if (this.isDown('ArrowRight')) {
            player.vx = player.speed;
        }
        
        // Jumping is handled in physics update or game loop via checks
    }
}
