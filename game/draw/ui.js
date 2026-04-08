const crosshairImg = new Image();
crosshairImg.src = 'game/graphics/untitled.png';

export function drawUI(ctx, score, mouseX, mouseY) {
    ctx.fillStyle = "white";
    ctx.font = "8px monospace";
    ctx.textAlign = "left";
    ctx.fillText(`SCORE: ${score}`, 4, 10);

    ctx.imageSmoothingEnabled = false;

    if (crosshairImg.complete) {
        const scale = 1;
        const w = crosshairImg.width * scale;
        const h = crosshairImg.height * scale;
        ctx.drawImage(crosshairImg, mouseX - w / 2, mouseY - h / 2, w, h);
    }
}
