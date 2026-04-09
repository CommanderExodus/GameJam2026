import { CONFIG } from '../config.js';
import { BugManager } from '../entities/bug.js';
import { drawGun } from '../draw/gun.js';
import { drawUI } from '../draw/ui.js';
import { CloudManager } from '../draw/cloud.js';
import { EnvHandler } from '../draw/env.js';
import { setupEventListeners } from './mouse.js';
import { StartMenu } from './start_menu.js';
import { loadImage } from '../utils/imageLoader.js';
import { drawHoverButton, isInsideBounds } from '../utils/buttonRenderer.js';

export class GameHandler {
    constructor(canvas, ctx) {
        this.canvas = canvas;
        this.ctx = ctx;
        this.score = 0;
        this.frames = 0;
        this.highScore = parseInt(localStorage.getItem('highScore')) || 0;

        this.envHandler = new EnvHandler(this);
        this.bugManager = new BugManager(this);
        this.cloudManager = new CloudManager(this);

        this.mouseX = canvas.width / 2;
        this.mouseY = canvas.height / 2;
        this.isShooting = false;
        this.flashTimer = 0;
        this.timerSeconds = CONFIG.gameplay.timerDuration;
        this.lastUpdateTime = performance.now();
        this.isGameOver = false;
        this.gameOverTimer = 0;

        this.isGameRunning = false;
        this.startFadeTimer = 0;
        this.startMenu = new StartMenu(this);

        this.backButtonBounds = {
            x: canvas.width / 2 - CONFIG.button.width / 2,
            y: canvas.height / 2 + CONFIG.gameOver.menuButtonYOffset,
            width: CONFIG.button.width,
            height: CONFIG.button.height,
        };

        this.menuButtonImg = loadImage(CONFIG.assets.ui.menuButton);

        setupEventListeners(this);
    }

    resetToMenu() {
        this.isGameOver = false;
        this.isGameRunning = false;
        this.score = 0;
        this.frames = 0;
        this.timerSeconds = CONFIG.gameplay.timerDuration;
        this.bugManager.bugs = [];
        this.startMenu = new StartMenu(this);
    }

    startActualGame() {
        this.isGameRunning = true;
        this.startFadeTimer = CONFIG.gameplay.startFadeDuration;
    }

    update() {
        const now = performance.now();
        const deltaSeconds = (now - this.lastUpdateTime) / 1000;
        this.lastUpdateTime = now;

        if (this.isGameRunning && !this.isGameOver) {
            this.timerSeconds -= deltaSeconds;
            if (this.timerSeconds <= 0) {
                this.timerSeconds = 0;
                this.isGameOver = true;
                this.gameOverTimer = 0;
                if (this.score > this.highScore) {
                    this.highScore = this.score;
                    localStorage.setItem('highScore', this.highScore);
                }
            }
        }

        this.ctx.imageSmoothingEnabled = false;
        this.ctx.clearRect(0, 0, this.canvas.width, this.canvas.height);

        if (this.isGameOver) {
            this.drawGameOver();
            return;
        }

        if (!this.isGameRunning) {
            this.startMenu.draw();
            return;
        }

        this.drawGameplay();
    }

    drawGameplay() {
        this.envHandler.drawBackground();
        this.bugManager.spawn();
        this.bugManager.updateAndDraw();
        this.envHandler.drawGrass();
        this.cloudManager.update();
        drawGun(this);

        if (this.flashTimer > 0) {
            this.flashTimer--;
        }

        if (this.startFadeTimer > 0) {
            const alpha = this.startFadeTimer / CONFIG.gameplay.startFadeDuration;
            this.ctx.fillStyle = `rgba(0, 0, 0, ${alpha})`;
            this.ctx.fillRect(0, 0, this.canvas.width, this.canvas.height);
            this.startFadeTimer--;
        }

        drawUI(this);
        this.frames++;
    }

    drawGameOver() {
        this.gameOverTimer++;

        this.envHandler.drawBackground();
        this.bugManager.updateAndDraw();
        this.envHandler.drawGrass();
        this.cloudManager.update();
        drawGun(this);

        const { fadeDuration, waitDuration } = CONFIG.gameOver;

        const alpha = Math.min(1, this.gameOverTimer / fadeDuration);
        this.ctx.fillStyle = `rgba(0, 0, 0, ${alpha})`;
        this.ctx.fillRect(0, 0, this.canvas.width, this.canvas.height);

        if (this.gameOverTimer > fadeDuration + waitDuration) {
            this.ctx.font = `${CONFIG.ui.gameOverFontSize}px ${CONFIG.ui.fontFamily}`;
            this.ctx.textAlign = 'center';
            this.ctx.fillStyle = 'white';

            this.ctx.fillText('SCORE', this.canvas.width * CONFIG.gameOver.scoreLeftX, this.canvas.height / 2 + CONFIG.gameOver.scoreLabelY);
            this.ctx.fillText(`${this.score}`, this.canvas.width * CONFIG.gameOver.scoreLeftX, this.canvas.height / 2);

            this.ctx.fillText('BEST', this.canvas.width * CONFIG.gameOver.scoreRightX, this.canvas.height / 2 + CONFIG.gameOver.scoreLabelY);
            this.ctx.fillText(`${this.highScore}`, this.canvas.width * CONFIG.gameOver.scoreRightX, this.canvas.height / 2);

            drawHoverButton(this.ctx, this.menuButtonImg, this.backButtonBounds, this.mouseX, this.mouseY, this.frames);

            this.ctx.textAlign = 'left';
        }

        drawUI(this, true);
        this.frames++;
    }
}
