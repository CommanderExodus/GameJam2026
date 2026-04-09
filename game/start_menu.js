export class StartMenu {
    constructor(game) {
        this.game = game;
        this.background = new Image();
        this.background.src = 'game/graphics/env/background.png';
        this.grass = new Image();
        this.grass.src = 'game/graphics/env/grass.png';
        this.startButton = new Image();
        this.startButton.src = 'game/graphics/ui/start.png';
        this.crosshair = new Image();
        this.crosshair.src = 'game/graphics/ui/crosshair.png';
        this.logo = new Image();
        this.logo.src = 'game/graphics/ui/Bug_Hunt_Logo.png';

        // Button dimensions on the 160x120 canvas
        this.buttonWidth = 80;
        this.buttonHeight = 25; // Adjusted to be proportional
        this.buttonX = (this.game.canvas.width - this.buttonWidth) / 2;
        this.buttonY = this.game.canvas.height * 0.7;

        this.isLoaded = false;
        let imagesToLoad = 5; // Increased for logo

        const imageLoaded = () => {
            imagesToLoad--;
            if (imagesToLoad === 0) {
                this.isLoaded = true;
            }
        };

        this.background.onload = imageLoaded;
        this.grass.onload = imageLoaded;
        this.startButton.onload = imageLoaded;
        this.crosshair.onload = imageLoaded;
        this.logo.onload = imageLoaded;

        this.frames = 0; // Local frame counter for start menu animations

        this.handleMouseDown = this.handleMouseDown.bind(this);
        this.game.canvas.addEventListener('mousedown', this.handleMouseDown);
    }

    draw() {
        if (!this.isLoaded) {
            this.game.ctx.fillStyle = '#87CEEB'; // Sky blue while loading
            this.game.ctx.fillRect(0, 0, this.game.canvas.width, this.game.canvas.height);
            return;
        }

        // Draw background
        this.game.ctx.drawImage(this.background, 0, 0, this.game.canvas.width, this.game.canvas.height);
        
        // Draw grass (at the bottom)
        const grassHeight = 27; // From env.js
        this.game.ctx.drawImage(this.grass, 0, this.game.canvas.height - grassHeight, this.game.canvas.width, grassHeight);

        // Update and draw clouds
        this.game.cloudManager.update();

        // Draw Logo (Top)
        const logoWidth = 120; // Proportional width for 160px canvas
        const logoHeight = (this.logo.height / this.logo.width) * logoWidth;
        const logoX = (this.game.canvas.width - logoWidth) / 2;
        const logoY = 10 + Math.sin(this.frames * 0.05) * 2; // Floating animation
        this.game.ctx.drawImage(this.logo, logoX, logoY, logoWidth, logoHeight);

        const mouseX = this.game.mouseX;
        const mouseY = this.game.mouseY;
        const isHovered = mouseX >= this.buttonX && mouseX <= this.buttonX + this.buttonWidth &&
                          mouseY >= this.buttonY && mouseY <= this.buttonY + this.buttonHeight;

        let drawY = this.buttonY + Math.sin(this.frames * 0.05) * 1;
        let drawX = this.buttonX;

        if (isHovered) {
            drawY += 2;
            this.game.ctx.filter = 'brightness(80%)';
        }

        // Draw start button
        this.game.ctx.drawImage(this.startButton, drawX, drawY, this.buttonWidth, this.buttonHeight);

        this.game.ctx.filter = 'none';

        // Draw high score bottom right
        this.game.ctx.font = "6px 'Press Start 2P', monospace";
        this.game.ctx.textAlign = "right";
        this.game.ctx.fillStyle = "black";
        this.game.ctx.fillText(`BEST:${this.game.highScore || 0}`, this.game.canvas.width - 4, this.game.canvas.height - 4);
        this.game.ctx.fillStyle = "white";
        this.game.ctx.fillText(`BEST:${this.game.highScore || 0}`, this.game.canvas.width - 4, this.game.canvas.height - 5);
        this.game.ctx.textAlign = "left";

        // Draw crosshair at mouse position using calculation from ui.js
        const scale = 1;
        const w = this.crosshair.width * scale;
        const h = this.crosshair.height * scale;
        this.game.ctx.drawImage(this.crosshair, this.game.mouseX - w / 2, this.game.mouseY - h / 2, w, h);

        this.frames++;
    }

    handleMouseDown(event) {
        if (event.button !== 0) return;
        if (this.game.isGameRunning) return;

        // The mouseX and mouseY in game object are already scaled and relative to canvas
        const mouseX = this.game.mouseX;
        const mouseY = this.game.mouseY;

        if (mouseX >= this.buttonX && mouseX <= this.buttonX + this.buttonWidth &&
            mouseY >= this.buttonY && mouseY <= this.buttonY + this.buttonHeight) {
            this.game.canvas.removeEventListener('mousedown', this.handleMouseDown);
            this.game.startActualGame();
        }
    }
}
