import { CONFIG } from '../config.js';
import { loadImages } from '../utils/imageLoader.js';
import { isInsideBounds } from '../utils/buttonRenderer.js';

const butterflyImages = loadImages(CONFIG.assets.butterfly);

export class Butterfly {
    constructor(canvas) {
        this.size = CONFIG.butterfly.size;

        this.amplitudeX = CONFIG.butterfly.amplitudeX;
        this.amplitudeY = CONFIG.butterfly.amplitudeY;
        this.frequency = CONFIG.butterfly.frequency;
        this.time = 0;
        this.images = butterflyImages;
        this.frame = 0;
        this.animationSpeed = 10;

        // Choose a random edge to spawn on
        const edge = Math.floor(Math.random() * 4); // 0: left, 1: right, 2: top, 3: bottom
        if (edge === 0) { // left
            this.centerX = -this.size;
            this.centerY = Math.random() * canvas.height;
            this.targetX = canvas.width + this.size;
            this.targetY = Math.random() * canvas.height;
        } else if (edge === 1) { // right
            this.centerX = canvas.width + this.size;
            this.centerY = Math.random() * canvas.height;
            this.targetX = -this.size;
            this.targetY = Math.random() * canvas.height;
        } else if (edge === 2) { // top
            this.centerX = Math.random() * canvas.width;
            this.centerY = -this.size;
            this.targetX = Math.random() * canvas.width;
            this.targetY = canvas.height + this.size;
        } else { // bottom
            this.centerX = Math.random() * canvas.width;
            this.centerY = canvas.height + this.size;
            this.targetX = Math.random() * canvas.width;
            this.targetY = -this.size;
        }
        
        this.x = this.centerX;
        this.y = this.centerY;
        
        this.driftSpeed = 0.5; // how fast it drifts towards target

        this.isDead = false;
        this.deathTimer = 0;
        this.vy = 0;
    }

    update() {
        if (this.isDead) {
            this.deathTimer++;
            if (this.deathTimer >= CONFIG.bug.deathFreezeFrames) {
                this.y += this.vy;
            }
            return;
        }

        // normal movement
        const dx = this.targetX - this.centerX;
        const dy = this.targetY - this.centerY;
        const dist = Math.sqrt(dx * dx + dy * dy);
        if (dist > 1) {
            this.centerX += (dx / dist) * this.driftSpeed;
            this.centerY += (dy / dist) * this.driftSpeed;
        }

        this.time += this.frequency;
        this.x = this.centerX + Math.sin(this.time) * this.amplitudeX + Math.sin(this.time * 2) * (this.amplitudeX / 2);
        this.y = this.centerY + Math.cos(this.time * 1.5) * this.amplitudeY;
        this.frame++;
    }

    draw(ctx) {
        const currentImg = this.images[Math.floor(this.frame / this.animationSpeed) % this.images.length];
        if (!currentImg.complete) return;

        if (this.isDead && this.deathTimer >= CONFIG.bug.deathBlinkThreshold) {
            if (Math.floor(this.deathTimer / CONFIG.bug.deathBlinkInterval) % 2 === 0) return;
        }

        ctx.save();
        ctx.translate(this.x, this.y);
        if (this.isDead) ctx.scale(1, -1);
        ctx.drawImage(currentImg, -this.size / 2, -this.size / 2, this.size, this.size);
        ctx.restore();
    }

    isOffScreen(canvas) {
        return this.x < -this.size * 2 || this.x > canvas.width + this.size * 2 ||
               this.y < -this.size * 2 || this.y > canvas.height + this.size * 2;
    }

    checkHit(mouseX, mouseY) {
        const hitBounds = { x: this.x - this.size / 2, y: this.y - this.size / 2, width: this.size, height: this.size };
        return isInsideBounds(mouseX, mouseY, hitBounds);
    }
}