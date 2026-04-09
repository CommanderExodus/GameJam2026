import { CONFIG } from '../config.js';
import { loadImages } from '../utils/imageLoader.js';
import { isInsideBounds } from '../utils/buttonRenderer.js';
import { shouldHideDuringBlink, isDeathFrozen } from '../utils/deathAnimation.js';

const butterflyImages = loadImages(CONFIG.assets.butterfly);

export class Butterfly {
    constructor(canvas) {
        this.size = CONFIG.butterfly.size;
        this.amplitudeX = CONFIG.butterfly.amplitudeX;
        this.amplitudeY = CONFIG.butterfly.amplitudeY;
        this.frequency = CONFIG.butterfly.frequency;
        this.time = 0;
        this.frame = 0;

        const edge = Math.floor(Math.random() * 4);
        if (edge === 0) {
            this.centerX = -this.size;
            this.centerY = Math.random() * canvas.height;
            this.targetX = canvas.width + this.size;
            this.targetY = Math.random() * canvas.height;
        } else if (edge === 1) {
            this.centerX = canvas.width + this.size;
            this.centerY = Math.random() * canvas.height;
            this.targetX = -this.size;
            this.targetY = Math.random() * canvas.height;
        } else if (edge === 2) {
            this.centerX = Math.random() * canvas.width;
            this.centerY = -this.size;
            this.targetX = Math.random() * canvas.width;
            this.targetY = canvas.height + this.size;
        } else {
            this.centerX = Math.random() * canvas.width;
            this.centerY = canvas.height + this.size;
            this.targetX = Math.random() * canvas.width;
            this.targetY = -this.size;
        }

        this.x = this.centerX;
        this.y = this.centerY;

        this.isDead = false;
        this.deathTimer = 0;
        this.vy = 0;
    }

    update() {
        if (this.isDead) {
            this.deathTimer++;
            if (!isDeathFrozen(this.deathTimer)) {
                this.y += this.vy;
            }
            return;
        }

        const dx = this.targetX - this.centerX;
        const dy = this.targetY - this.centerY;
        const dist = Math.sqrt(dx * dx + dy * dy);
        if (dist > 1) {
            this.centerX += (dx / dist) * CONFIG.butterfly.driftSpeed;
            this.centerY += (dy / dist) * CONFIG.butterfly.driftSpeed;
        }

        this.time += this.frequency;
        this.x = this.centerX + Math.sin(this.time) * this.amplitudeX + Math.sin(this.time * 2) * (this.amplitudeX / 2);
        this.y = this.centerY + Math.cos(this.time * 1.5) * this.amplitudeY;
        this.frame++;
    }

    draw(ctx) {
        const currentImg = butterflyImages[Math.floor(this.frame / CONFIG.butterfly.animationSpeed) % butterflyImages.length];
        if (!currentImg.complete) return;
        if (this.isDead && shouldHideDuringBlink(this.deathTimer)) return;

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

    kill() {
        this.isDead = true;
        this.deathTimer = 0;
        this.vy = CONFIG.death.fallSpeed;
    }

    checkHit(mouseX, mouseY) {
        const hitBounds = { x: this.x - this.size / 2, y: this.y - this.size / 2, width: this.size, height: this.size };
        return isInsideBounds(mouseX, mouseY, hitBounds);
    }
}