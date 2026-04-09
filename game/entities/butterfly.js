import { CONFIG } from '../config.js';
import { loadImages } from '../utils/imageLoader.js';
import { isInsideBounds } from '../utils/buttonRenderer.js';

const butterflyImages = loadImages(CONFIG.assets.butterfly);

export class Butterfly {
    constructor(canvas) {
        this.size = CONFIG.butterfly.size;
        this.centerX = canvas.width / 2;
        this.centerY = canvas.height / 2;
        this.x = this.centerX;
        this.y = this.centerY;
        this.amplitudeX = CONFIG.butterfly.amplitudeX;
        this.amplitudeY = CONFIG.butterfly.amplitudeY;
        this.frequency = CONFIG.butterfly.frequency;
        this.time = 0;
        this.images = butterflyImages;
        this.frame = 0;
        this.animationSpeed = 10; // change image every 10 frames

        // Choose a random edge to fly towards
        const edge = Math.floor(Math.random() * 4); // 0: left, 1: right, 2: top, 3: bottom
        if (edge === 0) { // left
            this.targetX = -this.size;
            this.targetY = canvas.height / 2;
        } else if (edge === 1) { // right
            this.targetX = canvas.width + this.size;
            this.targetY = canvas.height / 2;
        } else if (edge === 2) { // top
            this.targetX = canvas.width / 2;
            this.targetY = -this.size;
        } else { // bottom
            this.targetX = canvas.width / 2;
            this.targetY = canvas.height + this.size;
        }
        this.driftSpeed = 0.5; // how fast it drifts towards target
    }

    update() {
        // Move center towards target
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
        ctx.drawImage(currentImg, this.x - this.size / 2, this.y - this.size / 2, this.size, this.size);
    }

    isOffScreen(canvas) {
        return this.x < -this.size || this.x > canvas.width + this.size ||
               this.y < -this.size || this.y > canvas.height + this.size;
    }

    checkHit(mouseX, mouseY) {
        const hitBounds = { x: this.x - this.size / 2, y: this.y - this.size / 2, width: this.size, height: this.size };
        return isInsideBounds(mouseX, mouseY, hitBounds);
    }
}