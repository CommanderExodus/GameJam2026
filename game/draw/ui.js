const crosshairImg = new Image();
crosshairImg.src = 'game/graphics/ui/crosshair.png';

export function drawUI(game) {
    game.ctx.imageSmoothingEnabled = false;
    game.ctx.font = "6px 'Press Start 2P', monospace";
    game.ctx.textAlign = "left";
    
    // Draw black outline for score
    game.ctx.fillStyle = "black";
    game.ctx.fillText(`SCORE: ${game.score}`, 3, 10);
    game.ctx.fillText(`SCORE: ${game.score}`, 5, 10);
    game.ctx.fillText(`SCORE: ${game.score}`, 4, 9);
    game.ctx.fillText(`SCORE: ${game.score}`, 4, 11);

    // Draw white text for score
    game.ctx.fillStyle = "white";
    game.ctx.fillText(`SCORE: ${game.score}`, 4, 10);

    const timerValue = Math.max(0, Math.ceil(game.timerSeconds));
    
    // Draw black outline for timer
    game.ctx.textAlign = "right";
    game.ctx.fillStyle = "black";
    game.ctx.fillText(`TIME: ${timerValue}`, game.canvas.width - 5, 10);
    game.ctx.fillText(`TIME: ${timerValue}`, game.canvas.width - 3, 10);
    game.ctx.fillText(`TIME: ${timerValue}`, game.canvas.width - 4, 9);
    game.ctx.fillText(`TIME: ${timerValue}`, game.canvas.width - 4, 11);
    
    // Draw white text for timer
    game.ctx.fillStyle = "white";
    game.ctx.fillText(`TIME: ${timerValue}`, game.canvas.width - 4, 10);
    
    game.ctx.textAlign = "left";

    if (crosshairImg.complete) {
        const scale = 1;
        const w = crosshairImg.width * scale;
        const h = crosshairImg.height * scale;
        game.ctx.drawImage(crosshairImg, game.mouseX - w / 2, game.mouseY - h / 2, w, h);
    }
}
