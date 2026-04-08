export class Duck {
    constructor(canvas, grassY) {
        this.size = 40;
        this.x = Math.random() * (canvas.width - this.size - 40) + 20;
        this.y = grassY + 10;

        this.vy = -(Math.random() * 6 + 10);
        this.vx = (Math.random() - 0.5) * 4;

        this.gravity = 0.25;
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
            ctx.fillRect(this.x + 25, this.y + 10, 8, 8);
            ctx.fillStyle = "black";
            ctx.fillRect(this.x + 29, this.y + 12, 4, 4);
        }
    }
}