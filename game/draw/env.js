import { CONFIG } from '../config.js';
import { loadImage } from '../utils/imageLoader.js';

export class EnvHandler {
    constructor(game) {
        this.game = game;
        this.grassHeight = 30;
        this.grassY = game.canvas.height - this.grassHeight;
        this.backgroundImg = loadImage(CONFIG.assets.env.background);
        this.grassImg = loadImage(CONFIG.assets.env.grass);
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
