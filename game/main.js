import { GameHandler } from './handler/game.js';
import { CONFIG } from './config.js';

const canvas = document.getElementById('gameCanvas');
const ctx = canvas.getContext('2d');
const game = new GameHandler(canvas, ctx);

const frameDuration = 1000 / CONFIG.gameplay.targetFps;
let lastTime = performance.now();
let accumulator = 0;

function gameLoop(now) {
    const elapsed = now - lastTime;
    lastTime = now;

    // Cap accumulated time to prevent spiral-of-death after tab switch / long pause
    accumulator += Math.min(elapsed, frameDuration * 5);

    while (accumulator >= frameDuration) {
        game.update();
        accumulator -= frameDuration;
    }

    requestAnimationFrame(gameLoop);
}

requestAnimationFrame(gameLoop);
