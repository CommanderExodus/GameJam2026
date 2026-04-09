import { CONFIG } from '../config.js';
import { loadImage } from '../utils/imageLoader.js';

export class EnvHandler {
    constructor(game) {
        this.game = game;
        this.grassHeight = 30;
        this.grassY = game.canvas.height - this.grassHeight;
        this.backgroundImg = loadImage(CONFIG.assets.env.background);
        this.grassImg = loadImage(CONFIG.assets.env.grass);
        this.sunImg = loadImage(CONFIG.assets.env.sun);
    }

    drawBackground() {
        if (this.backgroundImg.complete) {
            this.game.ctx.drawImage(this.backgroundImg, 0, 0, this.game.canvas.width, this.game.canvas.height);
        }

        if (this.sunImg.complete) {
            const bobY = Math.sin(this.game.frames * CONFIG.sun.bobFrequency) * CONFIG.sun.bobAmplitude;
            this.game.ctx.drawImage(this.sunImg, CONFIG.sun.x, CONFIG.sun.y + bobY);
        }
    }

    drawGrass() {
        if (this.grassImg.complete) {
            this.game.ctx.drawImage(this.grassImg, 0, this.grassY, this.game.canvas.width, this.grassHeight);
        }
    }
}
