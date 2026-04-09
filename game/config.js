export const CONFIG = {
    canvas: {
        width: 160,
        height: 120,
        displayWidth: 800,
        displayHeight: 600,
    },

    gameplay: {
        timerDuration: 20,
        flashDuration: 20,
        startFadeDuration: 30,
        targetFps: 60,
    },

    bug: {
        size: 20,
        minSpawnRate: 30,
        maxSpawnRate: 120,
        spawnRateScoreMultiplier: 2,
        minLaunchSpeed: 2,
        launchSpeedRange: 1.5,
        horizontalSpeedRange: 1.5,
        gravity: 0.05,
        deathFallSpeed: 1.2,
        deathFreezeFrames: 15,
        deathBlinkInterval: 12,
        deathBlinkThreshold: 10,
        spawnYOffset: 2,
        edgePadding: 4,
        hitboxPadding: 8,
    },

    cloud: {
        maxCount: 4,
        initialMinCount: 2,
        initialMaxCount: 4,
        minSpawnDelay: 60,
        spawnDelayRange: 60,
        offscreenSpawnMargin: 100,
        offscreenRemoveMargin: 200,
        minDepth: 0.5,
        depthRange: 0.5,
        minSpeed: 0.1,
        speedRange: 0.2,
        minScale: 0.4,
        scaleRange: 0.4,
        swayFrequency: 0.02,
        swayAmplitude: 3,
        scaleFrequency: 0.05,
        scaleAmplitude: 0.1,
        maxYFraction: 1 / 3,
    },

    gun: {
        defaultScale: 0.8,
        scaleFrequency: 0.04,
        scaleAmplitude: 0.05,
        mouseSwayFactor: 0.05,
        breathingFreqX: 0.05,
        breathingAmpX: 2,
        breathingFreqY: 0.025,
        breathingAmpY: 1,
        muzzleScale: 0.5,
        muzzleFrameCount: 6,
        fallbackFlashY: -15,
    },

    ui: {
        fontFamily: "'Press Start 2P', monospace",
        fontSize: 6,
        gameOverFontSize: 8,
        crosshairScale: 1,
        scoreX: 4,
        scoreY: 10,
        timerPadding: 4,
        timerY: 10,
        outlineOffsets: [
            { x: -1, y: 0 },
            { x: 1, y: 0 },
            { x: 0, y: -1 },
            { x: 0, y: 1 },
        ],
    },

    button: {
        width: 80,
        height: 25,
        bobFrequency: 0.05,
        bobAmplitude: 1,
        hoverOffset: 2,
        hoverBrightness: 'brightness(80%)',
    },

    gameOver: {
        fadeDuration: 60,
        waitDuration: 60,
        menuButtonYOffset: 15,
        scoreLabelY: -15,
        scoreLeftX: 0.3,
        scoreRightX: 0.7,
    },

    highScore: {
        fontSize: 8,
        paddingRight: 4,
        paddingTop: 12,
        shadowOffset: 1,
    },

    logo: {
        width: 100,
        xOffset: -5,
        yOffset: -5,
        bobFrequency: 0.05,
        bobAmplitude: 1,
    },

    assets: {
        bugs: [
            'game/graphics/bugs/302.png',
            'game/graphics/bugs/404.png',
            'game/graphics/bugs/500.png',
            'game/graphics/bugs/gelb.png',
        ],
        clouds: [
            'game/graphics/clouds/1.png',
        ],
        gun: {
            idle: 'game/graphics/gun/a.png',
            firing: 'game/graphics/gun/b.png',
            muzzlePrefix: 'game/graphics/gun/muzzle_',
        },
        env: {
            background: 'game/graphics/env/background.png',
            grass: 'game/graphics/env/grass.png',
        },
        ui: {
            crosshair: 'game/graphics/ui/crosshair.png',
            startButton: 'game/graphics/ui/start.png',
            menuButton: 'game/graphics/ui/menu.png',
            logo: 'game/graphics/ui/logo.png',
        },
    },
};
