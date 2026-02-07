export class SaveManager {
    constructor() {
        this.STORAGE_KEY = 'shadowlands_save';
    }

    save(level, score) {
        const data = {
            maxLevel: level,
            highScore: score
        };
        
        // Only save if better than existing? 
        // Spec says "resume later", so we should save current progress usually.
        // User Story 6 says "continue from their saved level".
        // Let's load first to check if we should overwrite high score, but level we should definitely save the highest reached or current?
        // Spec: "Game MUST save the player's highest reached level locally"
        
        const existing = this.load();
        if (existing) {
            data.maxLevel = Math.max(level, existing.maxLevel);
            data.highScore = Math.max(score, existing.highScore);
        }

        try {
            localStorage.setItem(this.STORAGE_KEY, JSON.stringify(data));
            console.log('Progress Saved:', data);
        } catch (e) {
            console.error('Failed to save progress', e);
        }
    }

    load() {
        try {
            const data = localStorage.getItem(this.STORAGE_KEY);
            return data ? JSON.parse(data) : null;
        } catch (e) {
            console.error('Failed to load progress', e);
            return null;
        }
    }
    
    clear() {
        localStorage.removeItem(this.STORAGE_KEY);
    }
}
