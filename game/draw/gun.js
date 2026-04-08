const gunImgA = new Image();
gunImgA.src = 'game/graphics/gun_1_a.png';

const gunImgB = new Image();
gunImgB.src = 'game/graphics/gun_1_b.png';

export function drawGun(ctx, canvas, mouseX, mouseY, flashTimer) {
    const centerX = canvas.width / 2;

    // DOOM style sway: Gun moves a percentage of the distance toward the mouse
    // Limit the sway so it doesn't leave the screen entirely
    let swayX = (mouseX - centerX) * 0.15;
    let swayY = (mouseY - canvas.height / 2) * 0.05;

    ctx.save();
    // Anchor the gun at the bottom center, applying the sway
    ctx.translate(centerX + swayX, canvas.height + swayY);

    const gunImg = flashTimer > 0 ? gunImgB : gunImgA;
    const scale = 3.5; // adjust scale as needed

    // Disable anti-aliasing for crisp pixel art scaling
    ctx.imageSmoothingEnabled = false;

    let height = 0;
    if (gunImg.complete) {
        // Draw the gun image centered horizontally and anchored at the bottom
        const width = gunImg.width * scale;
        height = gunImg.height * scale;
        ctx.drawImage(gunImg, -width / 2, -height, width, height);
    }

    // Muzzle Flash
    if (flashTimer > 0) {
        // adjust Y offset for the muzzle flash to be exactly at the tip of the scaled gun
        const flashY = gunImg.complete ? -height : -190;
        
        ctx.fillStyle = "rgba(255, 165, 0, 0.8)"; // Orange flash
        ctx.beginPath();
        ctx.arc(0, flashY, Math.random() * 20 + 20, 0, Math.PI * 2);
        ctx.fill();

        ctx.fillStyle = "rgba(255, 255, 0, 0.9)"; // Yellow inner flash
        ctx.beginPath();
        ctx.arc(0, flashY, Math.random() * 10 + 10, 0, Math.PI * 2);
        ctx.fill();
    }

    ctx.restore();
}
