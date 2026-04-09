import { CONFIG } from '../config.js';
import { loadImage, onAllLoaded } from '../utils/imageLoader.js';
import { drawOutlinedText } from '../utils/textRenderer.js';
import { drawHoverButton, isInsideBounds } from '../utils/buttonRenderer.js';

export class StartMenu {
    constructor(game) {
        this.game = game;

        this.backgroundImg = loadImage(CONFIG.assets.env.background);
        this.grassImg = loadImage(CONFIG.assets.env.grass);
        this.startButtonImg = loadImage(CONFIG.assets.ui.startButton);
        this.crosshairImg = loadImage(CONFIG.assets.ui.crosshair);

        this.buttonBounds = {
            x: (game.canvas.width - CONFIG.button.width) / 2,
            y: game.canvas.height * 0.7,
            width: CONFIG.button.width,
            height: CONFIG.button.height,
        };

        this.isLoaded = false;
        onAllLoaded(
            [this.backgroundImg, this.grassImg, this.startButtonImg, this.crosshairImg],
            () => { this.isLoaded = true; }
        );

        this.frames = 0;

        this.handleMouseDown = this.handleMouseDown.bind(this);
        game.canvas.addEventListener('mousedown', this.handleMouseDown);
    }

    draw() {
        if (!this.isLoaded) {
            this.game.ctx.fillStyle = '#87CEEB';
            this.game.ctx.fillRect(0, 0, this.game.canvas.width, this.game.canvas.height);
            return;
        }

        this.game.ctx.drawImage(this.backgroundImg, 0, 0, this.game.canvas.width, this.game.canvas.height);

        const grassHeight = this.game.envHandler.grassHeight;
        this.game.ctx.drawImage(this.grassImg, 0, this.game.canvas.height - grassHeight, this.game.canvas.width, grassHeight);

        this.game.cloudManager.update();

        drawHoverButton(
            this.game.ctx, this.startButtonImg, this.buttonBounds,
            this.game.mouseX, this.game.mouseY, this.frames
        );

        drawOutlinedText(
            this.game.ctx,
            `BEST:${this.game.highScore}`,
            this.game.canvas.width - CONFIG.highScore.paddingRight,
            this.game.canvas.height - CONFIG.highScore.paddingBottom,
            { align: 'right', font: `${CONFIG.highScore.fontSize}px ${CONFIG.ui.fontFamily}` }
        );

        if (this.crosshairImg.complete) {
            const width = this.crosshairImg.width * CONFIG.ui.crosshairScale;
            const height = this.crosshairImg.height * CONFIG.ui.crosshairScale;
            this.game.ctx.drawImage(this.crosshairImg, this.game.mouseX - width / 2, this.game.mouseY - height / 2, width, height);
        }

        this.frames++;
    }

    handleMouseDown(event) {
        if (event.button !== 0) return;
        if (this.game.isGameRunning) return;

        if (isInsideBounds(this.game.mouseX, this.game.mouseY, this.buttonBounds)) {
            this.game.canvas.removeEventListener('mousedown', this.handleMouseDown);
            this.game.startActualGame();
        }
    }
}
