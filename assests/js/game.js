const canvas = document.getElementById("gameCanvas");
const ctx = canvas.getContext("2d");

canvas.width = 800;
canvas.height = 400;

// JUGADOR
const player = {
    x: 100,
    y: 300,
    width: 40,
    height: 40,
    velY: 0,
    gravity: 0.8,
    jump: -12,
    grounded: true
};

// OBSTÁCULOS
let obstacles = [];
let frame = 0;
let score = 0;
let gameOver = false;

// CONTROLES TECLADO
document.addEventListener("keydown", (e) => {
    if (e.code === "Space" && player.grounded) {
        player.velY = player.jump;
        player.grounded = false;
    }
});

/* 📱 CONTROLES MÓVILES (AGREGADO) */
const btnUp = document.getElementById("btnUp");

if(btnUp){
    // Funciona en la mayoría de dispositivos
    btnUp.addEventListener("pointerdown", (e) => {
        e.preventDefault();
        if (player.grounded) {
            player.velY = player.jump;
            player.grounded = false;
        }
    });

    // Refuerzo para celulares
    btnUp.addEventListener("touchstart", () => {
        if (player.grounded) {
            player.velY = player.jump;
            player.grounded = false;
        }
    });
}

// CREAR OBSTÁCULOS
function createObstacle() {
    obstacles.push({
        x: canvas.width,
        y: 320,
        width: 30,
        height: 80
    });
}

// ACTUALIZAR
function update() {
    if (gameOver) return;

    frame++;

    // GRAVEDAD
    player.velY += player.gravity;
    player.y += player.velY;

    // SUELO
    if (player.y + player.height >= canvas.height) {
        player.y = canvas.height - player.height;
        player.velY = 0;
        player.grounded = true;
    }

    // OBSTÁCULOS
    if (frame % 100 === 0) {
        createObstacle();
    }

    obstacles.forEach((obs, index) => {
        obs.x -= 5;

        // COLISIÓN
        if (
            player.x < obs.x + obs.width &&
            player.x + player.width > obs.x &&
            player.y < obs.y + obs.height &&
            player.y + player.height > obs.y
        ) {
            gameOver = true;
        }

        // SUMAR PUNTOS
        if (obs.x + obs.width < player.x && !obs.passed) {
            score++;
            obs.passed = true;
        }

        // ELIMINAR
        if (obs.x < -50) {
            obstacles.splice(index, 1);
        }
    });
}

// DIBUJAR
function draw() {
    ctx.clearRect(0, 0, canvas.width, canvas.height);

    // JUGADOR
    ctx.fillStyle = "cyan";
    ctx.fillRect(player.x, player.y, player.width, player.height);

    // OBSTÁCULOS
    ctx.fillStyle = "red";
    obstacles.forEach(obs => {
        ctx.fillRect(obs.x, obs.y, obs.width, obs.height);
    });

    // SCORE
    ctx.fillStyle = "white";
    ctx.font = "20px Arial";
    ctx.fillText("Score: " + score, 10, 30);

    // GAME OVER
    if (gameOver) {
        ctx.font = "40px Arial";
        ctx.fillText("GAME OVER", 280, 200);
    }
}

// LOOP
function gameLoop() {
    update();
    draw();
    requestAnimationFrame(gameLoop);
}

gameLoop();