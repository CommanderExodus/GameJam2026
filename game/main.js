import { GameHandler } from './handler/game.js';

const canvas = document.getElementById('gameCanvas');
const ctx = canvas.getContext('2d');

const game = new GameHandler(canvas, ctx);

function gameLoop() {
    game.update();
    requestAnimationFrame(gameLoop);
}

// The game loop starts immediately, but GameHandler will manage the start screen.
gameLoop();
