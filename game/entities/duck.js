// bugs in disguise
const bugImages = [
    'game/graphics/bugs/404.png',
    'game/graphics/bugs/500.png',
    'game/graphics/bugs/gelb.png',
    'game/graphics/bugs/red.png'
].map(src => {
    const img = new Image();
    img.src = src;
    return img;
});

export class Bug {
    constructor(canvas, grassY) {
        this.size = 20;
        this.x = Math.random() * (canvas.width - this.size - 8) + 4;
        this.y = grassY + 2;

        this.vy = -(Math.random() * 1.5 + 2);
        this.vx = (Math.random() - 0.5) * 1.5;

        this.gravity = 0.05;
        this.isDead = false;

        this.img = bugImages[Math.floor(Math.random() * bugImages.length)];
    }

    update() {
        this.vy += this.gravity;
        this.x += this.vx;
        this.y += this.vy;
    }

    draw(ctx) {
        if (!this.img.complete) return;
        ctx.save();
        ctx.translate(this.x + this.size / 2, this.y + this.size / 2);
        if (this.isDead) ctx.scale(1, -1);
        ctx.imageSmoothingEnabled = false;
        ctx.drawImage(this.img, -this.size / 2, -this.size / 2, this.size, this.size);
        ctx.restore();
    }
}

export class BugManager {
    constructor(game) {
        this.game = game;
        this.bugs = [];
    }

    spawn() {
        let spawnRate = Math.max(30, 120 - this.game.score * 2);
        if (this.game.frames % spawnRate === 0) {
            this.bugs.push(new Bug(this.game.canvas, this.game.envHandler.grassY));
        }
    }

    updateAndDraw() {
        for (let i = this.bugs.length - 1; i >= 0; i--) {
            let b = this.bugs[i];
            b.update();
            b.draw(this.game.ctx);
            if (b.y > this.game.canvas.height + b.size) {
                this.bugs.splice(i, 1);
            }
        }
    }

    checkHit(mouseX, mouseY) {
        for (let i = this.bugs.length - 1; i >= 0; i--) {
            let b = this.bugs[i];
            if (!b.isDead) {
                if (mouseX > b.x && mouseX < b.x + b.size &&
                    mouseY > b.y && mouseY < b.y + b.size) {
                    if (mouseY < this.game.envHandler.grassY) {
                        b.isDead = true;
                        b.vy = 2;
                        b.vx = 0;
                        return true;
                    }
                }
            }
        }
        return false;
    }
}
