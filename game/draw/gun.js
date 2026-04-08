const gunImgA = new Image();
gunImgA.src = 'game/graphics/gun/a.png';

const gunImgB = new Image();
gunImgB.src = 'game/graphics/gun/b.png';

export function drawGun(game) {
    const centerX = game.canvas.width / 2;

    const swayX = (game.mouseX - centerX) * 0.05;
    const swayY = (game.mouseY - game.canvas.height / 2) * 0.05;
    const breathingSwayX = Math.sin(game.frames * 0.05) * 2;
    const breathingSwayY = Math.cos(game.frames * 0.025) * 1;

    game.ctx.save();
    game.ctx.translate(centerX + swayX + breathingSwayX, game.canvas.height + swayY + breathingSwayY);

    const gunImg = game.flashTimer > 0 ? gunImgB : gunImgA;
    const scale = 0.8 + Math.sin(game.frames * 0.04) * 0.05; 
    game.ctx.imageSmoothingEnabled = false;

    let height = 0;
    if (gunImg.complete) {
        const width = gunImg.width * scale;
        height = gunImg.height * scale;
        game.ctx.drawImage(gunImg, -width / 2, -height, width, height);
    }

    if (game.flashTimer > 0) {
        const flashY = gunImg.complete ? -height : -15;
        
        game.ctx.fillStyle = "rgba(255, 165, 0, 0.8)";
        game.ctx.beginPath();
        game.ctx.arc(0, flashY, Math.random() * 2 + 2, 0, Math.PI * 2);
        game.ctx.fill();

        game.ctx.fillStyle = "rgba(255, 255, 0, 0.9)";
        game.ctx.beginPath();
        game.ctx.arc(0, flashY, Math.random() * 1 + 1, 0, Math.PI * 2);
        game.ctx.fill();
    }

    game.ctx.restore();
}
