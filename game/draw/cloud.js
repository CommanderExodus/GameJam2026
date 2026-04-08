const cloudImages = [
    'game/graphics/clouds/a.png'
].map(src => {
    const img = new Image();
    img.src = src;
    return img;
});

export class CloudManager {
    constructor(canvas) {
        this.canvas = canvas;
        this.clouds = [];
    }

    spawnCloud(frames) {
        // Randomly spawn a cloud
        if (Math.random() < 0.009) {
            const img = cloudImages[Math.floor(Math.random() * cloudImages.length)];
            const y = Math.random() * (this.canvas.height / 3);
            const speed = (Math.random() * 0.2 + 0.1) * (Math.random() < 0.5 ? 1 : -1);
            const x = speed > 0 ? -100 : this.canvas.width + 100;
            const baseScale = Math.random() * 0.5 + 0.5;

            this.clouds.push({
                x, y, vx: speed, img, baseScale, spawnFrame: frames
            });
        }
    }

    update(ctx, frames) {
        this.spawnCloud(frames);

        for (let i = this.clouds.length - 1; i >= 0; i--) {
            let c = this.clouds[i];
            c.x += c.vx;

            const age = frames - c.spawnFrame;
            // Swaying similar to gun.js
            const swayY = Math.sin(age * 0.02) * 5;
            // Scale fun like gun.js
            const scale = c.baseScale * (1 + Math.sin(age * 0.05) * 0.1);

            if (c.img.complete) {
                const width = c.img.width * scale;
                const height = c.img.height * scale;
                ctx.imageSmoothingEnabled = false;
                ctx.drawImage(c.img, c.x - width / 2, c.y + swayY - height / 2, width, height);
            }

            if ((c.vx > 0 && c.x > this.canvas.width + 200) || (c.vx < 0 && c.x < -200)) {
                this.clouds.splice(i, 1);
            }
        }
    }

    isPointObscured(px, py, frames) {
        for (let c of this.clouds) {
            if (!c.img.complete) continue;
            
            const age = frames - c.spawnFrame;
            const swayY = Math.sin(age * 0.02) * 5;
            const scale = c.baseScale * (1 + Math.sin(age * 0.05) * 0.1);
            
            const width = c.img.width * scale;
            const height = c.img.height * scale;
            
            const cx = c.x - width / 2;
            const cy = c.y + swayY - height / 2;
            
            if (px > cx && px < cx + width && py > cy && py < cy + height) {
                return true;
            }
        }
        return false;
    }
}
