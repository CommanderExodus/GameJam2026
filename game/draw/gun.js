const gunImgA = new Image();
gunImgA.src = 'game/graphics/gun_1_a.png';

const gunImgB = new Image();
gunImgB.src = 'game/graphics/gun_1_b.png';

export function drawGun(ctx, canvas, mouseX, mouseY, flashTimer, frames) {
    const centerX = canvas.width / 2;

    // DOOM style sway: Gun moves a percentage of the distance toward the mouse
    // Limit the sway so it doesn't leave the screen entirely
    let swayX = (mouseX - centerX) * 0.05;
    let swayY = (mouseY - canvas.height / 2) * 0.05;

    // Human breathing sway
    const breathingSwayX = Math.sin(frames * 0.05) * 2;
    const breathingSwayY = Math.cos(frames * 0.025) * 1;

    ctx.save();
    // Anchor the gun at the bottom center, applying the sway and breathing
    ctx.translate(centerX + swayX + breathingSwayX, canvas.height + swayY + breathingSwayY);

    const gunImg = flashTimer > 0 ? gunImgB : gunImgA;

    // Subtle scale sway between 0.75 and 0.85
    const scale = 0.8 + Math.sin(frames * 0.04) * 0.05; 

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
        const flashY = gunImg.complete ? -height : -15;
        
        ctx.fillStyle = "rgba(255, 165, 0, 0.8)"; // Orange flash
        ctx.beginPath();
        ctx.arc(0, flashY, Math.random() * 2 + 2, 0, Math.PI * 2);
        ctx.fill();

        ctx.fillStyle = "rgba(255, 255, 0, 0.9)"; // Yellow inner flash
        ctx.beginPath();
        ctx.arc(0, flashY, Math.random() * 1 + 1, 0, Math.PI * 2);
        ctx.fill();
    }

    ctx.restore();
}
