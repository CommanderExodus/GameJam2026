export class Duck {
    constructor(canvas, grassY) {
        this.size = 8;
        this.x = Math.random() * (canvas.width - this.size - 8) + 4;
        this.y = grassY + 2;

        this.vy = -(Math.random() * 1.2 + 2);
        this.vx = (Math.random() - 0.5) * 0.8;

        this.gravity = 0.05;
        this.isDead = false;
    }

    update() {
        this.vy += this.gravity;
        this.x += this.vx;
        this.y += this.vy;
    }

    draw(ctx) {
        ctx.fillStyle = this.isDead ? "#555" : "#FF4500";
        ctx.fillRect(this.x, this.y, this.size, this.size);

        if (!this.isDead) {
            ctx.fillStyle = "white";
            ctx.fillRect(this.x + 5, this.y + 2, 2, 2);
            ctx.fillStyle = "black";
            ctx.fillRect(this.x + 6, this.y + 2, 1, 1);
        }
    }
}