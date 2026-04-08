export function drawGun(ctx, canvas, mouseX, mouseY, flashTimer) {
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
    }

    ctx.restore();
}
