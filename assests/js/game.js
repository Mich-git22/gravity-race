const canvas = document.getElementById("gameCanvas");
const ctx = canvas.getContext("2d");

canvas.width = 800;
canvas.height = 400;

// 🚫 BLOQUEAR ZOOM Y GESTOS (AGREGADO)
document.addEventListener("gesturestart", function (e) {
    e.preventDefault();
});
document.addEventListener("gesturechange", function (e) {
    e.preventDefault();
});
document.addEventListener("gestureend", function (e) {
    e.preventDefault();
});

// 🚫 BLOQUEAR DOBLE TAP
let lastTouch = 0;
document.addEventListener("touchend", function (e) {
    let now = Date.now();
    if (now - lastTouch <= 300) {
        e.preventDefault();
    }
    lastTouch = now;
}, false);

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

// TECLADO
document.addEventListener("keydown", (e) => {
    if (e.code === "Space" && player.grounded) {
        saltar();
    }
});

// 🔥 FUNCIÓN DE SALTO
function saltar(){
    if (player.grounded) {
        player.velY = player.jump;
        player.grounded = false;
    }
}

/* 📱 TOUCH REAL */

// tocar canvas
canvas.addEventListener("pointerdown", saltar);

// fallback
canvas.addEventListener("touchstart", (e)=>{
    e.preventDefault();
    saltar();
}, {passive:false});

// botón ⬆️
const btnUp = document.getElementById("btnUp");

if(btnUp){
    btnUp.addEventListener("pointerdown", (e)=>{
        e.preventDefault();
        saltar();
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

// UPDATE
function update() {
    if (gameOver) return;

    frame++;

    player.velY += player.gravity;
    player.y += player.velY;

    if (player.y + player.height >= canvas.height) {
        player.y = canvas.height - player.height;
        player.velY = 0;
        player.grounded = true;
    }

    if (frame % 100 === 0) {
        createObstacle();
    }

    obstacles.forEach((obs, index) => {
        obs.x -= 5;

        if (
            player.x < obs.x + obs.width &&
            player.x + player.width > obs.x &&
            player.y < obs.y + obs.height &&
            player.y + player.height > obs.y
        ) {
            gameOver = true;
        }

        if (obs.x + obs.width < player.x && !obs.passed) {
            score++;
            obs.passed = true;
        }

        if (obs.x < -50) {
            obstacles.splice(index, 1);
        }
    });
}

// DRAW
function draw() {
    ctx.clearRect(0, 0, canvas.width, canvas.height);

    ctx.fillStyle = "cyan";
    ctx.fillRect(player.x, player.y, player.width, player.height);

    ctx.fillStyle = "red";
    obstacles.forEach(obs => {
        ctx.fillRect(obs.x, obs.y, obs.width, obs.height);
    });

    ctx.fillStyle = "white";
    ctx.font = "20px Arial";
    ctx.fillText("Score: " + score, 10, 30);

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