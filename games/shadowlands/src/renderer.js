export class Renderer {
    constructor(ctx, canvasWidth, canvasHeight) {
        this.ctx = ctx;
        this.width = canvasWidth;
        this.height = canvasHeight;
    }

    clear() {
        this.ctx.fillStyle = '#222'; // Background color
        this.ctx.fillRect(0, 0, this.width, this.height);
    }

    drawEntity(entity, camera) {
        if (entity.draw) {
            entity.draw(this.ctx, camera);
        }
    }

    drawRect(x, y, w, h, color, camera) {
        this.ctx.fillStyle = color;
        this.ctx.fillRect(x - camera.x, y - camera.y, w, h);
    }
    
    drawText(text, x, y, color, size = 20) {
        this.ctx.fillStyle = color;
        this.ctx.font = `${size}px 'Courier New'`;
        this.ctx.fillText(text, x, y);
    }
}