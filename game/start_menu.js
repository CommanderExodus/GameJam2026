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

        // Button dimensions on the 160x120 canvas
        this.buttonWidth = 80;
        this.buttonHeight = 25; // Adjusted to be proportional
        this.buttonX = (this.game.canvas.width - this.buttonWidth) / 2;
        this.buttonY = this.game.canvas.height * 0.7;

        this.isLoaded = false;
        let imagesToLoad = 4; // Increased to account for crosshair

        const imageLoaded = () => {
            imagesToLoad--;
            if (imagesToLoad === 0) {
                this.isLoaded = true;
            }
        };

        this.background.onload = imageLoaded;
        this.grass.onload = imageLoaded;
        this.startButton.onload = imageLoaded;
        this.crosshair.onload = imageLoaded; // Load crosshair image

        this.frames = 0; // Local frame counter for start menu animations

        this.handleClick = this.handleClick.bind(this);
        this.game.canvas.addEventListener('click', this.handleClick);
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

        // Draw crosshair at mouse position using calculation from ui.js
        const scale = 1;
        const w = this.crosshair.width * scale;
        const h = this.crosshair.height * scale;
        this.game.ctx.drawImage(this.crosshair, this.game.mouseX - w / 2, this.game.mouseY - h / 2, w, h);

        this.frames++;
    }

    handleClick(event) {
        if (this.game.isGameRunning) return;

        // The mouseX and mouseY in game object are already scaled and relative to canvas
        const mouseX = this.game.mouseX;
        const mouseY = this.game.mouseY;

        if (mouseX >= this.buttonX && mouseX <= this.buttonX + this.buttonWidth &&
            mouseY >= this.buttonY && mouseY <= this.buttonY + this.buttonHeight) {
            this.game.canvas.removeEventListener('click', this.handleClick);
            this.game.startActualGame();
        }
    }
}
