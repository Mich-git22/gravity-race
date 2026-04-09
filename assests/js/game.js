const canvas = document.getElementById("gameCanvas");
const ctx = canvas.getContext("2d");

canvas.width = 900;
canvas.height = 500;

let score = 0;
let gravedad = null;

const nave = {
x:100,
y:250,
size:40,
velX:2,
velY:0
};

let meteoritos = [];

canvas.addEventListener("click",function(e){

const rect = canvas.getBoundingClientRect();

gravedad = {
x:e.clientX - rect.left,
y:e.clientY - rect.top
};

});

function crearMeteorito(){

meteoritos.push({
x:900,
y:Math.random()*450,
size:30,
vel:3+Math.random()*3
});

}

setInterval(crearMeteorito,2000);

function update(){

nave.x += nave.velX;

if(gravedad){

let dx = gravedad.x - nave.x;
let dy = gravedad.y - nave.y;

nave.velY += dy * 0.001;

}

nave.y += nave.velY;

meteoritos.forEach(m=>{
m.x -= m.vel;
});

meteoritos = meteoritos.filter(m=>m.x>-50);

}

function draw(){

ctx.clearRect(0,0,canvas.width,canvas.height);

ctx.fillStyle="cyan";

ctx.beginPath();
ctx.arc(nave.x,nave.y,nave.size,0,Math.PI*2);
ctx.fill();

meteoritos.forEach(m=>{

ctx.fillStyle="red";

ctx.beginPath();
ctx.arc(m.x,m.y,m.size,0,Math.PI*2);
ctx.fill();

});

}

function gameLoop(){

update();
draw();

requestAnimationFrame(gameLoop);

}

gameLoop();