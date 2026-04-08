const cloudImages = [
    'game/graphics/clouds/1.png'
].map(src => {
    const img = new Image();
    img.src = src;
    return img;
});

export class Cloud {
    constructor(canvas, frames) {
        this.canvas = canvas;
        this.img = cloudImages[Math.floor(Math.random() * cloudImages.length)];
        this.y = Math.random() * (canvas.height / 3);
        this.vx = (Math.random() * 0.2 + 0.1) * (Math.random() < 0.5 ? 1 : -1);
        this.x = this.vx > 0 ? -100 : canvas.width + 100;
        this.baseScale = Math.random() * 0.5 + 0.5;
        this.spawnFrame = frames;
    }

    update() {
        this.x += this.vx;
    }

    draw(ctx, frames) {
        const age = frames - this.spawnFrame;
        const swayY = Math.sin(age * 0.02) * 5;
        const scale = this.baseScale * (1 + Math.sin(age * 0.05) * 0.1);

        if (this.img.complete) {
            const width = this.img.width * scale;
            const height = this.img.height * scale;
            ctx.imageSmoothingEnabled = false;
            ctx.drawImage(this.img, this.x - width / 2, this.y + swayY - height / 2, width, height);
        }
    }

    isOffscreen() {
        return (this.vx > 0 && this.x > this.canvas.width + 200) || (this.vx < 0 && this.x < -200);
    }

    isPointObscured(px, py, frames) {
        if (!this.img.complete) return false;
        
        const age = frames - this.spawnFrame;
        const swayY = Math.sin(age * 0.02) * 5;
        const scale = this.baseScale * (1 + Math.sin(age * 0.05) * 0.1);
        
        const width = this.img.width * scale;
        const height = this.img.height * scale;
        
        const cx = this.x - width / 2;
        const cy = this.y + swayY - height / 2;
        
        return px > cx && px < cx + width && py > cy && py < cy + height;
    }
}

export class CloudManager {
    constructor(canvas) {
        this.canvas = canvas;
        this.clouds = [];
    }

    spawnCloud(frames) {
        if (Math.random() < 0.005) {
            this.clouds.push(new Cloud(this.canvas, frames));
        }
    }

    update(ctx, frames) {
        this.spawnCloud(frames);

        for (let i = this.clouds.length - 1; i >= 0; i--) {
            let c = this.clouds[i];
            c.update();
            c.draw(ctx, frames);

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
