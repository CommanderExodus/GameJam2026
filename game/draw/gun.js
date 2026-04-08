const gunImgA = new Image();
gunImgA.src = 'game/graphics/gun/a.png';

const gunImgB = new Image();
gunImgB.src = 'game/graphics/gun/b.png';

export function drawGun(ctx, canvas, mouseX, mouseY, flashTimer, frames) {
    const centerX = canvas.width / 2;

    const swayX = (mouseX - centerX) * 0.05;
    const swayY = (mouseY - canvas.height / 2) * 0.05;
    const breathingSwayX = Math.sin(frames * 0.05) * 2;
    const breathingSwayY = Math.cos(frames * 0.025) * 1;

    ctx.save();
    ctx.translate(centerX + swayX + breathingSwayX, canvas.height + swayY + breathingSwayY);

    const gunImg = flashTimer > 0 ? gunImgB : gunImgA;
    const scale = 0.8 + Math.sin(frames * 0.04) * 0.05; 
    ctx.imageSmoothingEnabled = false;

    let height = 0;
    if (gunImg.complete) {
        const width = gunImg.width * scale;
        height = gunImg.height * scale;
        ctx.drawImage(gunImg, -width / 2, -height, width, height);
    }

    if (flashTimer > 0) {
        const flashY = gunImg.complete ? -height : -15;
        
        ctx.fillStyle = "rgba(255, 165, 0, 0.8)";
        ctx.beginPath();
        ctx.arc(0, flashY, Math.random() * 2 + 2, 0, Math.PI * 2);
        ctx.fill();

        ctx.fillStyle = "rgba(255, 255, 0, 0.9)";
        ctx.beginPath();
        ctx.arc(0, flashY, Math.random() * 1 + 1, 0, Math.PI * 2);
        ctx.fill();
    }

    ctx.restore();
}
