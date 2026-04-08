const canvas = document.getElementById('gameCanvas');
const ctx = canvas.getContext('2d');

let score = 0;
let frames = 0;
let ducks = [];
let mouseX = canvas.width / 2;
let mouseY = canvas.height / 2;
let isShooting = false;
let flashTimer = 0;

const grassHeight = 150;
const grassY = canvas.height - grassHeight;

canvas.addEventListener('mousemove', (e) => {
    const rect = canvas.getBoundingClientRect();
    mouseX = e.clientX - rect.left;
    mouseY = e.clientY - rect.top;
});

canvas.addEventListener('mousedown', (e) => {
    if (e.button !== 0) return;

    isShooting = true;
    flashTimer = 5;

    // Check for hits
    for (let i = ducks.length - 1; i >= 0; i--) {
        let d = ducks[i];
        if (!d.isDead) {
            // Check if click is inside the square
            if (mouseX > d.x && mouseX < d.x + d.size &&
                mouseY > d.y && mouseY < d.y + d.size) {

                // You can't shoot them if they are hidden behind the grass
                if (mouseY < grassY) {
                    d.isDead = true;
                    d.vy = 8; // Fall straight down quickly
                    d.vx = 0;
                    score++;
                    break; // Only kill one per shot
                }
            }
        }
    }
});

canvas.addEventListener('mouseup', () => {
    isShooting = false;
});

class Duck {
    constructor() {
        this.size = 40;
        // Spawn randomly along the width, keeping inside bounds
        this.x = Math.random() * (canvas.width - this.size - 40) + 20;
        // Start just below the grass line
        this.y = grassY + 10;

        // Random upward velocity and slight horizontal drift
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

    draw() {
        ctx.fillStyle = this.isDead ? "#555" : "#FF4500"; // Gray if dead, Orange/Red if alive
        ctx.fillRect(this.x, this.y, this.size, this.size);

        // Draw a little "eye" for character
        if (!this.isDead) {
            ctx.fillStyle = "white";
            ctx.fillRect(this.x + 25, this.y + 10, 8, 8);
            ctx.fillStyle = "black";
            ctx.fillRect(this.x + 29, this.y + 12, 4, 4);
        }
    }
}

function spawnDuck() {
    let spawnRate = Math.max(60, 120 - score * 2);
    if (frames % spawnRate === 0) {
        ducks.push(new Duck());
    }
}

function drawGrass() {
    ctx.fillStyle = "#228B22"; // Forest Green
    ctx.fillRect(0, grassY, canvas.width, grassHeight);

    // Add some texture/blades to the top of the grass
    ctx.fillStyle = "#006400"; // Dark Green
    for (let i = 0; i < canvas.width; i += 20) {
        ctx.beginPath();
        ctx.moveTo(i, grassY);
        ctx.lineTo(i + 10, grassY - 15);
        ctx.lineTo(i + 20, grassY);
        ctx.fill();
    }
}

function drawGun() {
    const centerX = canvas.width / 2;

    // DOOM style sway: Gun moves a percentage of the distance toward the mouse
    // Limit the sway so it doesn't leave the screen entirely
    let swayX = (mouseX - centerX) * 0.15;
    let swayY = (mouseY - canvas.height / 2) * 0.05;

    ctx.save();
    // Anchor the gun at the bottom center, applying the sway
    ctx.translate(centerX + swayX, canvas.height + swayY);

    // Draw Hand holding the gun
    ctx.fillStyle = "#d2b48c"; // Tan/Skin color
    ctx.fillRect(-25, -60, 50, 60);
    ctx.fillStyle = "#c8a47e"; // Shadow
    ctx.fillRect(-25, -60, 15, 60);

    // Draw Gun Body
    ctx.fillStyle = "#333";
    ctx.beginPath();
    ctx.moveTo(-15, -40);
    ctx.lineTo(15, -40);
    ctx.lineTo(10, -180); // Barrel end
    ctx.lineTo(-10, -180);
    ctx.fill();

    // Gun details
    ctx.fillStyle = "#111";
    ctx.fillRect(-5, -170, 10, 120);

    // Muzzle Flash
    if (flashTimer > 0) {
        ctx.fillStyle = "rgba(255, 165, 0, 0.8)"; // Orange flash
        ctx.beginPath();
        ctx.arc(0, -190, Math.random() * 20 + 20, 0, Math.PI * 2);
        ctx.fill();

        ctx.fillStyle = "rgba(255, 255, 0, 0.9)"; // Yellow inner flash
        ctx.beginPath();
        ctx.arc(0, -190, Math.random() * 10 + 10, 0, Math.PI * 2);
        ctx.fill();

        flashTimer--;
    }

    ctx.restore();
}

function drawUI() {
    ctx.fillStyle = "white";
    ctx.font = "24px monospace";
    ctx.textAlign = "left";
    ctx.fillText(`SCORE: ${score}`, 20, 40);

    // Draw custom crosshair exactly at mouse position
    ctx.strokeStyle = "rgba(0, 255, 0, 0.7)";
    ctx.lineWidth = 2;
    ctx.beginPath();
    ctx.moveTo(mouseX - 15, mouseY);
    ctx.lineTo(mouseX + 15, mouseY);
    ctx.moveTo(mouseX, mouseY - 15);
    ctx.lineTo(mouseX, mouseY + 15);
    ctx.stroke();

    ctx.beginPath();
    ctx.arc(mouseX, mouseY, 10, 0, Math.PI * 2);
    ctx.stroke();
}

function gameLoop() {
    // Clear canvas
    ctx.clearRect(0, 0, canvas.width, canvas.height);

    spawnDuck();

    // Update and draw ducks
    // Ducks are drawn BEFORE the grass, so they hide behind it
    for (let i = ducks.length - 1; i >= 0; i--) {
        ducks[i].update();
        ducks[i].draw();

        // Remove ducks that have fallen off screen
        if (ducks[i].y > canvas.height) {
            ducks.splice(i, 1);
        }
    }

    drawGrass();
    drawGun();
    drawUI();

    frames++;
    requestAnimationFrame(gameLoop);
}

// Start the game
gameLoop();
