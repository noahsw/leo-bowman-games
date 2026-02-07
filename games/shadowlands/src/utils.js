export const Utils = {
    // Random integer between min (inclusive) and max (inclusive)
    randomInt(min, max) {
        return Math.floor(Math.random() * (max - min + 1)) + min;
    },

    // Random float between min (inclusive) and max (exclusive)
    randomFloat(min, max) {
        return Math.random() * (max - min) + min;
    },

    // Check intersection between two rectangles
    rectIntersect(r1, r2) {
        return !(r2.x >= r1.x + r1.w || 
                 r2.x + r2.w <= r1.x || 
                 r2.y >= r1.y + r1.h || 
                 r2.y + r2.h <= r1.y);
    },
    
    // Clamp a value between min and max
    clamp(value, min, max) {
        return Math.min(Math.max(value, min), max);
    }
};
