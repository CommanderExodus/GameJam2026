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

        setupEventListeners(this);
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
                this.ctx.fillText(`FINAL SCORE`, this.canvas.width / 2, this.canvas.height / 2 - 20);
                this.ctx.fillText(`${this.score}`, this.canvas.width / 2, this.canvas.height / 2 - 5);
                this.ctx.fillText(`HIGH SCORE`, this.canvas.width / 2, this.canvas.height / 2 + 15);
                this.ctx.fillText(`${this.highScore}`, this.canvas.width / 2, this.canvas.height / 2 + 30);
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
