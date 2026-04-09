import { CONFIG } from '../config.js';
import { Bobbing } from '../utils/bobbing.js';
import { loadImage, loadImageSequence } from '../utils/imageLoader.js';

const gunIdle = loadImage(CONFIG.assets.gun.idle);
const gunFiring = loadImage(CONFIG.assets.gun.firing);
const muzzleImages = loadImageSequence(CONFIG.assets.gun.muzzlePrefix, CONFIG.gun.muzzleFrameCount);

export function drawGun(game) {
    const centerX = game.canvas.width / 2;

    const isShooting = game.flashTimer > 0;

    const mouseSway = isShooting ? { x: 0, y: 0 } : Bobbing.getMouseSway(
        game.mouseX, game.mouseY,
        game.canvas.width, game.canvas.height,
        CONFIG.gun.mouseSwayFactor
    );

    const breathing = isShooting ? { x: 0, y: 0 } : Bobbing.getBreathing(
        game.frames,
        CONFIG.gun.breathingFreqX, CONFIG.gun.breathingAmpX,
        CONFIG.gun.breathingFreqY, CONFIG.gun.breathingAmpY
    );

    game.ctx.save();
    game.ctx.translate(
        centerX + mouseSway.x + breathing.x,
        game.canvas.height + mouseSway.y + breathing.y
    );

    const gunImg = isShooting ? gunFiring : gunIdle;
    const scale = isShooting ? CONFIG.gun.defaultScale : Bobbing.getScale(game.frames, CONFIG.gun.defaultScale, CONFIG.gun.scaleFrequency, CONFIG.gun.scaleAmplitude);

    let width = 0;
    let height = 0;
    if (gunImg.complete) {
        width = gunImg.width * scale;
        height = gunImg.height * scale;
    }

    if (game.flashTimer > 0) {
        const flashY = gunImg.complete ? -height : CONFIG.gun.fallbackFlashY;
        const flashDuration = CONFIG.gameplay.flashDuration;

        let frameIndex = Math.floor(((flashDuration - game.flashTimer) / flashDuration) * muzzleImages.length);
        frameIndex = Math.max(0, Math.min(muzzleImages.length - 1, frameIndex));

        const muzzleImg = muzzleImages[frameIndex];
        if (muzzleImg.complete) {
            const muzzleWidth = muzzleImg.width * scale * CONFIG.gun.muzzleScale;
            const muzzleHeight = muzzleImg.height * scale * CONFIG.gun.muzzleScale;
            game.ctx.drawImage(muzzleImg, -muzzleWidth / 2, flashY - muzzleHeight / 2, muzzleWidth, muzzleHeight);
        }
    }

    if (gunImg.complete) {
        game.ctx.drawImage(gunImg, -width / 2, -height, width, height);
    }

    game.ctx.restore();
}
