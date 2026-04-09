import { BugManager } from '../entities/duck.js';
import { drawGun } from '../draw/gun.js';
import { drawUI } from '../draw/ui.js';
import { CloudManager } from '../draw/cloud.js';
import { EnvHandler } from '../draw/env.js';
import { setupEventListeners } from './mouse.js';
import { StartMenu } from '../start_menu.js';

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
        this.timerSeconds = 20;
        this.lastUpdateTime = performance.now();
        this.isGameOver = false;
        this.gameOverTimer = 0;

        this.isGameRunning = false;
        this.startFadeTimer = 0;
        this.startMenu = new StartMenu(this);

        this.backButtonW = 80;
        this.backButtonH = 25;
        this.backButtonX = canvas.width / 2 - this.backButtonW / 2;
        this.backButtonY = canvas.height / 2 + 15;

        this.menuButtonImg = new Image();
        this.menuButtonImg.src = 'game/graphics/ui/menu.png';

        setupEventListeners(this);
    }

    resetToMenu() {
        this.isGameOver = false;
        this.isGameRunning = false;
        this.score = 0;
        this.frames = 0;
        this.timerSeconds = 20;
        this.bugManager.bugs = [];
        this.startMenu = new StartMenu(this);
    }

    startActualGame() {
        this.isGameRunning = true;
        this.startFadeTimer = 30; // 30 frames fade in
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
            this.gameOverTimer++;
            
            // Draw background stuff first so we can fade it
            this.envHandler.drawBackground();
            this.bugManager.updateAndDraw();
            this.envHandler.drawGrass();
            this.cloudManager.update();
            drawGun(this);

            const fadeDuration = 60; // 1 second roughly
            const waitDuration = 60;

            const alpha = Math.min(1, this.gameOverTimer / fadeDuration);
            this.ctx.fillStyle = `rgba(0, 0, 0, ${alpha})`;
            this.ctx.fillRect(0, 0, this.canvas.width, this.canvas.height);

            if (this.gameOverTimer > fadeDuration + waitDuration) {
                // Show score
                this.ctx.font = "8px 'Press Start 2P', monospace";
                this.ctx.textAlign = "center";
                this.ctx.fillStyle = "white";
                
                // Final Score
                this.ctx.fillText(`SCORE`, this.canvas.width * 0.3, this.canvas.height / 2 - 15);
                this.ctx.fillText(`${this.score}`, this.canvas.width * 0.3, this.canvas.height / 2);
                
                // High Score
                this.ctx.fillText(`BEST`, this.canvas.width * 0.7, this.canvas.height / 2 - 15);
                this.ctx.fillText(`${this.highScore}`, this.canvas.width * 0.7, this.canvas.height / 2);

                // Back to menu button
                const isHovered = this.mouseX >= this.backButtonX && this.mouseX <= this.backButtonX + this.backButtonW &&
                                  this.mouseY >= this.backButtonY && this.mouseY <= this.backButtonY + this.backButtonH;
                
                let drawY = this.backButtonY + Math.sin(this.frames * 0.05) * 1;
                let drawX = this.backButtonX;

                if (isHovered) {
                    drawY += 2;
                    this.ctx.filter = 'brightness(80%)';
                }

                if (this.menuButtonImg.complete) {
                    this.ctx.drawImage(this.menuButtonImg, drawX, drawY, this.backButtonW, this.backButtonH);
                }

                this.ctx.filter = 'none';
                
                this.ctx.textAlign = "left"; // reset
            }

            drawUI(this, true);
            
            this.frames++;
            return;
        }

        if (!this.isGameRunning) {
            this.startMenu.draw();
            return;
        }

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
            const alpha = this.startFadeTimer / 30;
            this.ctx.fillStyle = `rgba(0, 0, 0, ${alpha})`;
            this.ctx.fillRect(0, 0, this.canvas.width, this.canvas.height);
            this.startFadeTimer--;
        }

        drawUI(this);

        this.frames++;
    }
}
