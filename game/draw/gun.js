const gunImgA = new Image();
gunImgA.src = 'game/graphics/gun/a.png';

const gunImgB = new Image();
gunImgB.src = 'game/graphics/gun/b.png';

const muzzleImages = [];
for (let i = 1; i <= 6; i++) {
    const img = new Image();
    img.src = `game/graphics/gun/muzzle_${i}.png`;
    muzzleImages.push(img);
}

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

    let width = 0;
    let height = 0;
    if (gunImg.complete) {
        width = gunImg.width * scale;
        height = gunImg.height * scale;
    }

    if (game.flashTimer > 0) {
        const flashY = gunImg.complete ? -height : -15;
        
        const maxFrames = 20;
        let index = Math.floor(((maxFrames - game.flashTimer) / maxFrames) * muzzleImages.length);
        index = Math.max(0, Math.min(muzzleImages.length - 1, index));
        
        const muzzImg = muzzleImages[index];
        if (muzzImg.complete) {
            const muzzWidth = muzzImg.width * scale * 0.5;
            const h = muzzImg.height * scale * 0.5;
            game.ctx.drawImage(muzzImg, -muzzWidth / 2, flashY - h / 2, muzzWidth, h);
        }
    }

    if (gunImg.complete) {
        game.ctx.drawImage(gunImg, -width / 2, -height, width, height);
    }

    game.ctx.restore();
}
