const canvas = document.getElementById("gameCanvas");
const ctx = canvas.getContext("2d");

/* =========================
   🔥 AJUSTE RESPONSIVE REAL
========================= */
function ajustarPantalla(){
    canvas.width = window.innerWidth;
    canvas.height = window.innerHeight;
}

ajustarPantalla();
window.addEventListener("resize", ajustarPantalla);
window.addEventListener("orientationchange", () => {
    setTimeout(ajustarPantalla, 100);
});

/* =========================
   🔒 BLOQUEO ZOOM REAL
========================= */
document.addEventListener("gesturestart", e => e.preventDefault());
document.addEventListener("gesturechange", e => e.preventDefault());
document.addEventListener("gestureend", e => e.preventDefault());

document.addEventListener("touchmove", function(e){
    if (e.target.tagName === "CANVAS") {
        e.preventDefault();
    }
}, { passive:false });

/* 🚫 DOBLE TAP ZOOM */
let lastTouch = 0;
document.addEventListener("touchend", function (e) {
    let now = Date.now();
    if (now - lastTouch <= 300) {
        e.preventDefault();
    }
    lastTouch = now;
}, false);

/* =========================
   🚀 JUGADOR
========================= */
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

/* =========================
   OBSTÁCULOS
========================= */
let obstacles = [];
let frame = 0;
let score = 0;
let gameOver = false;

/* =========================
   CONTROLES TECLADO
========================= */
document.addEventListener("keydown", (e) => {
    if (e.code === "Space") {
        saltar();
    }
});

/* =========================
   🔥 SALTO
========================= */
function saltar(){
    if (player.grounded) {
        player.velY = player.jump;
        player.grounded = false;
    }
}

/* =========================
   📱 TOUCH MEJORADO
========================= */
canvas.addEventListener("pointerdown", function(e){
    e.preventDefault();
    saltar();
}, { passive:false });

/* =========================
   CREAR OBSTÁCULOS
========================= */
function createObstacle() {
    obstacles.push({
        x: canvas.width,
        y: canvas.height - 80,
        width: 30,
        height: 80
    });
}

/* =========================
   UPDATE
========================= */
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

/* =========================
   DRAW
========================= */
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
        ctx.fillText("GAME OVER", canvas.width/2 - 120, canvas.height/2);
    }
}

/* =========================
   LOOP
========================= */
function gameLoop() {
    update();
    draw();
    requestAnimationFrame(gameLoop);
}

gameLoop();