const crosshairImg = new Image();
crosshairImg.src = 'game/graphics/ui/crosshair.png';

export function drawUI(game) {
    game.ctx.fillStyle = "white";
    game.ctx.font = "8px monospace";
    game.ctx.textAlign = "left";
    game.ctx.fillText(`SCORE: ${game.score}`, 4, 10);

    if (crosshairImg.complete) {
        const scale = 1;
        const w = crosshairImg.width * scale;
        const h = crosshairImg.height * scale;
        game.ctx.drawImage(crosshairImg, game.mouseX - w / 2, game.mouseY - h / 2, w, h);
    }
}
