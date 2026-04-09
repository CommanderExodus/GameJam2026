const crosshairImg = new Image();
crosshairImg.src = 'game/graphics/ui/crosshair.png';

export function drawUI(game) {
    game.ctx.fillStyle = "white";
    game.ctx.font = "8px monospace";
    game.ctx.textAlign = "left";
    game.ctx.fillText(`SCORE: ${game.score}`, 4, 10);

    game.ctx.textAlign = "right";
    const timerValue = Math.max(0, Math.ceil(game.timerSeconds));
    game.ctx.fillText(`TIME: ${timerValue}`, game.canvas.width - 4, 10);
    game.ctx.textAlign = "left";

    if (crosshairImg.complete) {
        const scale = 1;
        const w = crosshairImg.width * scale;
        const h = crosshairImg.height * scale;
        game.ctx.drawImage(crosshairImg, game.mouseX - w / 2, game.mouseY - h / 2, w, h);
    }
}
