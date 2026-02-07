export const LevelSegments = [
    // Easy Segment A - Flat run with a star
    {
        difficulty: 1,
        width: 600,
        layout: [
            { type: 'platform', x: 0, y: 400, w: 600, h: 20 },
            { type: 'star', x: 280, y: 340 }
        ]
    },
    // Easy Segment B - Small step-ups
    {
        difficulty: 1,
        width: 700,
        layout: [
            { type: 'platform', x: 0, y: 400, w: 300, h: 20 },
            { type: 'platform', x: 250, y: 360, w: 200, h: 20 },
            { type: 'platform', x: 400, y: 400, w: 300, h: 20 },
            { type: 'star', x: 320, y: 300 }
        ]
    },
    // Easy Segment C - Gentle platforming
    {
        difficulty: 1,
        width: 800,
        layout: [
            { type: 'platform', x: 0, y: 400, w: 250, h: 20 },
            { type: 'platform', x: 200, y: 350, w: 200, h: 20 },
            { type: 'platform', x: 450, y: 400, w: 350, h: 20 },
            { type: 'star', x: 280, y: 290 }
        ]
    },
    // Medium Segment (Spikes)
    {
        difficulty: 2,
        width: 1000,
        layout: [
            { type: 'platform', x: 0, y: 400, w: 300, h: 20 },
            { type: 'spike', x: 100, y: 370 }, // Relative to platform logic? No, global relative to segment start
            { type: 'platform', x: 400, y: 350, w: 100, h: 20 },
            { type: 'platform', x: 600, y: 300, w: 200, h: 20 },
            { type: 'spike', x: 700, y: 270 }
        ]
    },
    // Hard Segment (Skeleton Blocks + Spikes)
    {
        difficulty: 3,
        width: 1200,
        layout: [
            { type: 'platform', x: 0, y: 400, w: 100, h: 20 },
            { type: 'skeleton', x: 200, y: 400, w: 100, h: 20 },
            { type: 'skeleton', x: 400, y: 400, w: 100, h: 20 },
            { type: 'platform', x: 600, y: 350, w: 200, h: 20 },
            { type: 'spike', x: 700, y: 320 },
            { type: 'star', x: 700, y: 200 }
        ]
    }
];
