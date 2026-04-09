import { BugManager } from '../entities/duck.js';
import { drawGun } from '../draw/gun.js';
import { drawUI } from '../draw/ui.js';
import { CloudManager } from '../draw/cloud.js';
import { EnvHandler } from '../draw/env.js';
import { setupEventListeners } from './mouse.js';

export class GameHandler {
    constructor(canvas, ctx) {
        this.canvas = canvas;
        this.ctx = ctx;
        this.score = 0;
        this.frames = 0;

        this.envHandler = new EnvHandler(this);
        this.bugManager = new BugManager(this);
        this.cloudManager = new CloudManager(this);

        this.mouseX = canvas.width / 2;
        this.mouseY = canvas.height / 2;
        this.isShooting = false;
        this.flashTimer = 0;
        this.timerSeconds = 120;
        this.lastUpdateTime = performance.now();

        setupEventListeners(this);
    }

    update() {
        const now = performance.now();
        const deltaSeconds = (now - this.lastUpdateTime) / 1000;
        this.lastUpdateTime = now;

        this.timerSeconds -= deltaSeconds;
        if (this.timerSeconds <= 0) {
            this.score = 0;
            this.timerSeconds = 120;
        }

        this.ctx.imageSmoothingEnabled = false;
        this.ctx.clearRect(0, 0, this.canvas.width, this.canvas.height);

        this.envHandler.drawBackground();
        this.bugManager.spawn();
        this.bugManager.updateAndDraw();

        this.envHandler.drawGrass();
        
        this.cloudManager.update();

        drawGun(this);
        
        if (this.flashTimer > 0) {
            this.flashTimer--;
        }

        drawUI(this);

        this.frames++;
    }
}
