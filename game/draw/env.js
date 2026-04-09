export class EnvHandler {
    constructor(game) {
        this.game = game;
        
        this.grassHeight = 30;
        this.grassY = game.canvas.height - this.grassHeight;

        this.backgroundImg = new Image();
        this.backgroundImg.src = 'game/graphics/env/background.png';

        this.grassImg = new Image();
        this.grassImg.src = 'game/graphics/env/grass.png';
    }

    drawBackground() {
        if (this.backgroundImg.complete) {
            this.game.ctx.drawImage(this.backgroundImg, 0, 0, this.game.canvas.width, this.game.canvas.height);
        }
    }

    drawGrass() {
        if (this.grassImg.complete) {
            this.game.ctx.drawImage(this.grassImg, 0, this.grassY, this.game.canvas.width, this.grassHeight);
        }
    }
}
