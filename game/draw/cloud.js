import { Bobbing } from '../utils/bobbing.js';

const cloudImages = [
    'game/graphics/clouds/1.png'
].map(src => {
    const img = new Image();
    img.src = src;
    return img;
});

export class Cloud {
    constructor(canvas, frames, startX = null) {
        this.canvas = canvas;
        this.img = cloudImages[Math.floor(Math.random() * cloudImages.length)];
        this.y = Math.random() * (canvas.height / 3);
        
        this.depth = Math.random() * 0.5 + 0.5; 
        
        this.vx = (Math.random() * 0.2 + 0.1) * this.depth * (Math.random() < 0.5 ? 1 : -1);
        
        if (startX !== null) {
            this.x = startX;
        } else {
            this.x = this.vx > 0 ? -100 : canvas.width + 100;
        }
        
        this.baseScale = (Math.random() * 0.4 + 0.4) * this.depth;
        this.spawnFrame = frames;
    }

    update() {
        this.x += this.vx;
    }

    getRenderProps(frames) {
        const age = frames - this.spawnFrame;
        const swayY = Bobbing.getSway(age, 0.02, 3);
        const scale = Bobbing.getScale(age, this.baseScale, 0.05, 0.1);

        const width = this.img.complete ? this.img.width * scale : 0;
        const height = this.img.complete ? this.img.height * scale : 0;
        
        return {
            x: this.x - width / 2,
            y: this.y + swayY - height / 2,
            width,
            height
        };
    }

    draw(ctx, frames) {
        if (!this.img.complete) return;

        const p = this.getRenderProps(frames);
        ctx.drawImage(this.img, p.x, p.y, p.width, p.height);
    }

    isOffscreen() {
        return (this.vx > 0 && this.x > this.canvas.width + 200) || (this.vx < 0 && this.x < -200);
    }

    isPointObscured(px, py, frames) {
        if (!this.img.complete) return false;
        
        const p = this.getRenderProps(frames);
        return px > p.x && px < p.x + p.width && py > p.y && py < p.y + p.height;
    }
}

export class CloudManager {
    constructor(game) {
        this.game = game;
        this.clouds = [];
        this.spawnTimer = 0;
        
        // Ensure there's always a few clouds on screen at start
        const initialClouds = Math.floor(Math.random() * 3) + 2; // 2 to 4 clouds
        for (let i = 0; i < initialClouds; i++) {
            const randomX = Math.random() * game.canvas.width;
            this.clouds.push(new Cloud(game.canvas, game.frames, randomX));
        }
    }

    spawnCloud() {
        if (this.clouds.length < 4) {
            if (this.spawnTimer <= 0) {
                this.clouds.push(new Cloud(this.game.canvas, this.game.frames));
                // Spawns within 1 to 2 seconds of a slot freeing up, or empty game
                this.spawnTimer = Math.floor(Math.random() * 60) + 60;
            } else {
                this.spawnTimer--;
            }
        }
    }

    update() {
        this.spawnCloud();

        this.clouds.sort((a, b) => a.depth - b.depth);

        for (let i = this.clouds.length - 1; i >= 0; i--) {
            let c = this.clouds[i];
            c.update();
            c.draw(this.game.ctx, this.game.frames);

            if (c.isOffscreen()) {
                this.clouds.splice(i, 1);
            }
        }
    }

    isPointObscured(px, py, frames) {
        for (let c of this.clouds) {
            if (c.isPointObscured(px, py, frames)) {
                return true;
            }
        }
        return false;
    }
}
