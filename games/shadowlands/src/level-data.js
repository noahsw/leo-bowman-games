export const LevelSegments = [
    // Easy Segment (Just platforms)
    {
        difficulty: 1,
        width: 1000,
        layout: [
            { type: 'platform', x: 0, y: 400, w: 200, h: 20 },
            { type: 'platform', x: 300, y: 350, w: 200, h: 20 },
            { type: 'platform', x: 600, y: 300, w: 200, h: 20 }
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
