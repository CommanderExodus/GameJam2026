export class EnvHandler {
    constructor(canvas, ctx) {
        this.canvas = canvas;
        this.ctx = ctx;
        
        this.grassHeight = 30;
        this.grassY = canvas.height - this.grassHeight;

        this.backgroundImg = new Image();
        this.backgroundImg.src = 'game/graphics/env/background.png';

        this.grassImg = new Image();
        this.grassImg.src = 'game/graphics/env/grass.png';
    }

    drawBackground() {
        if (this.backgroundImg.complete) {
            this.ctx.drawImage(this.backgroundImg, 0, 0, this.canvas.width, this.canvas.height);
        }
    }

    drawGrass() {
        if (this.grassImg.complete) {
            this.ctx.imageSmoothingEnabled = false;
            this.ctx.drawImage(this.grassImg, 0, this.grassY, this.canvas.width, this.grassHeight);
        }
    }
}
