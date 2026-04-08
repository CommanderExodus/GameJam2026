function gameLoop() {
    ctx.clearRect(0, 0, canvas.width, canvas.height);



    spawnDucks();
    drawGrass();
    drawGun();
    drawUI();

    frames++;
    requestAnimationFrame(gameLoop);
}

gameLoop();
