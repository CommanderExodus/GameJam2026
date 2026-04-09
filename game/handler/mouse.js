export function setupEventListeners(game) {
    game.canvas.addEventListener('mousemove', (e) => {
        const rect = game.canvas.getBoundingClientRect();
        const scaleX = game.canvas.width / rect.width;
        const scaleY = game.canvas.height / rect.height;

        game.mouseX = (e.clientX - rect.left) * scaleX;
        game.mouseY = (e.clientY - rect.top) * scaleY;
    });

    game.canvas.addEventListener('mousedown', (e) => {
        if (e.button !== 0) return;
        
        if (!game.isGameRunning) return;

        if (game.isGameOver) {
            const fadeDuration = 60;
            const waitDuration = 60;
            if (game.gameOverTimer > fadeDuration + waitDuration) {
                if (game.mouseX >= game.backButtonX && game.mouseX <= game.backButtonX + game.backButtonW &&
                    game.mouseY >= game.backButtonY && game.mouseY <= game.backButtonY + game.backButtonH) {
                    game.resetToMenu();
                }
            }
            return;
        }

        game.isShooting = true;
        game.flashTimer = 20;

        if (game.cloudManager.isPointObscured(game.mouseX, game.mouseY, game.frames)) {
            return;
        }

        if (game.bugManager.checkHit(game.mouseX, game.mouseY)) {
            game.score++;
        }
    });

    game.canvas.addEventListener('mouseup', () => {
        game.isShooting = false;
    });
}
