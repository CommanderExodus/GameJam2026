import { BugManager } from '../entities/duck.js';
import { drawGun } from '../draw/gun.js';
import { drawUI } from '../draw/ui.js';
import { CloudManager } from '../draw/cloud.js';
import { EnvHandler } from '../draw/env.js';

export class GameHandler {
    constructor(canvas, ctx) {
        this.canvas = canvas;
        this.ctx = ctx;
        this.score = 0;
        this.frames = 0;

        this.envHandler = new EnvHandler(canvas, ctx);
        this.bugManager = new BugManager(canvas, this.envHandler.grassY);
        this.cloudManager = new CloudManager(canvas);

        this.mouseX = canvas.width / 2;
        this.mouseY = canvas.height / 2;
        this.isShooting = false;
        this.flashTimer = 0;

        this.setupEventListeners();
    }

    setupEventListeners() {
        this.canvas.addEventListener('mousemove', (e) => {
            const rect = this.canvas.getBoundingClientRect();
            const scaleX = this.canvas.width / rect.width;
            const scaleY = this.canvas.height / rect.height;

            this.mouseX = (e.clientX - rect.left) * scaleX;
            this.mouseY = (e.clientY - rect.top) * scaleY;
        });

        this.canvas.addEventListener('mousedown', (e) => {
            if (e.button !== 0) return;

            this.isShooting = true;
            this.flashTimer = 20;

            // Check if shot is absorbed by a cloud
            if (this.cloudManager.isPointObscured(this.mouseX, this.mouseY, this.frames)) {
                return;
            }

            // Check for hits
            if (this.bugManager.checkHit(this.mouseX, this.mouseY)) {
                this.score++;
            }
        });

        this.canvas.addEventListener('mouseup', () => {
            this.isShooting = false;
        });
    }

    update() {
        this.ctx.imageSmoothingEnabled = false;
        this.ctx.clearRect(0, 0, this.canvas.width, this.canvas.height);

        this.envHandler.drawBackground();

        this.bugManager.spawn(this.frames, this.score);
        this.bugManager.updateAndDraw(this.ctx);

        this.envHandler.drawGrass();
        
        this.cloudManager.update(this.ctx, this.frames);

        drawGun(this.ctx, this.canvas, this.mouseX, this.mouseY, this.flashTimer, this.frames);
        
        if (this.flashTimer > 0) {
            this.flashTimer--;
        }

        drawUI(this.ctx, this.score, this.mouseX, this.mouseY);

        this.frames++;
    }
}
