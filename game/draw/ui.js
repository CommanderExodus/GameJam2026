const crosshairImg = new Image();
crosshairImg.src = 'game/graphics/Crosshair.png';

export function drawUI(ctx, score, mouseX, mouseY) {
    ctx.fillStyle = "white";
    ctx.font = "24px monospace";
    ctx.textAlign = "left";
    ctx.fillText(`SCORE: ${score}`, 20, 40);

    if (crosshairImg.complete) {
        ctx.drawImage(crosshairImg, mouseX - crosshairImg.width / 2, mouseY - crosshairImg.height / 2);
    }
}
