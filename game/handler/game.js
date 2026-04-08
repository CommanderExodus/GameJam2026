import { Duck } from '../entities/duck.js';
import { drawGun } from '../draw/gun.js';
import { drawUI } from '../draw/ui.js';
import { CloudManager } from '../draw/cloud.js';

export class GameHandler {
    constructor(canvas, ctx) {
        this.canvas = canvas;
        this.ctx = ctx;
        this.score = 0;
        this.frames = 0;
        this.ducks = [];
        this.cloudManager = new CloudManager(canvas);
        this.mouseX = canvas.width / 2;
        this.mouseY = canvas.height / 2;
        this.isShooting = false;
        this.flashTimer = 0;
        this.grassHeight = 30;
        this.grassY = canvas.height - this.grassHeight;

        // Load background image
        this.backgroundImg = new Image();
        this.backgroundImg.src = 'game/graphics/Background.png';

        // Load grass image
        this.grassImg = new Image();
        this.grassImg.src = 'game/graphics/Grass.png';

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
            for (let i = this.ducks.length - 1; i >= 0; i--) {
                let d = this.ducks[i];
                if (!d.isDead) {
                    if (this.mouseX > d.x && this.mouseX < d.x + d.size &&
                        this.mouseY > d.y && this.mouseY < d.y + d.size) {

                        if (this.mouseY < this.grassY) {
                            d.isDead = true;
                            d.vy = 2;
                            d.vx = 0;
                            this.score++;
                            break;
                        }
                    }
                }
            }
        });

        this.canvas.addEventListener('mouseup', () => {
            this.isShooting = false;
        });
    }

    spawnDuck() {
        let spawnRate = Math.max(60, 120 - this.score * 2);
        if (this.frames % spawnRate === 0) {
            this.ducks.push(new Duck(this.canvas, this.grassY));
        }
    }

    drawGrass() {
        if (this.grassImg.complete) {
            this.ctx.imageSmoothingEnabled = false;
            this.ctx.drawImage(this.grassImg, 0, this.grassY, this.canvas.width, this.grassHeight);
        }
    }

    update() {
        this.ctx.imageSmoothingEnabled = false;
        this.ctx.clearRect(0, 0, this.canvas.width, this.canvas.height);

        // Draw background
        if (this.backgroundImg.complete) {
            this.ctx.drawImage(this.backgroundImg, 0, 0, this.canvas.width, this.canvas.height);
        }

        this.spawnDuck();

        for (let i = this.ducks.length - 1; i >= 0; i--) {
            this.ducks[i].update();
            this.ducks[i].draw(this.ctx);

            if (this.ducks[i].y > this.canvas.height) {
                this.ducks.splice(i, 1);
            }
        }

        this.drawGrass();
        
        this.cloudManager.update(this.ctx, this.frames);

        // pass frames to drawGun to calculate sway based on time
        drawGun(this.ctx, this.canvas, this.mouseX, this.mouseY, this.flashTimer, this.frames);
        
        if (this.flashTimer > 0) {
            this.flashTimer--;
        }

        drawUI(this.ctx, this.score, this.mouseX, this.mouseY);

        this.frames++;
    }
}
