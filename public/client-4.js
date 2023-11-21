const canvas = document.getElementById('myCanvas');
const ctx = canvas.getContext('2d');
const socket = io();

const pos = {
    x: canvas.width / 2,
    y: canvas.height / 2,
    w: 40,
    h: 40
};
socket.on('connect', () => {
  console.log('Connected');
});
socket.on('disconnect', (reason) => {
  console.log('Connected');
});
socket.io.on('ping', () => {
  console.log('Ping');
});
socket.io.on('error', (error) => {
  console.log('Error', error);
});
socket.io.on('reconnect', (attempt) => {
  console.log('Reconnect', attempt);
});

socket.emit('hello', { a: 'b', c: [] });

socket.on('hey', (data) => {
  console.log('got hey', data);
});

function drawPlayer() {
    ctx.fillStyle = 'black';
    ctx.fillRect(pos.x - pos.w / 2, pos.y - pos.h / 2, pos.w, pos.h);
    
    // Draw a border around the player
    ctx.lineWidth = '10';
    ctx.strokeStyle = 'rgb(100, 0, 0)';
    ctx.lineJoin = 'round';
    ctx.strokeRect(pos.x - pos.w / 2, pos.y - pos.h / 2, pos.w, pos.h);
}

function drawBackground() {
    var lGrad = ctx.createLinearGradient(
        0, 0,
        0, canvas.height
    );
    lGrad.addColorStop(0, 'LightSkyBlue');
    lGrad.addColorStop(0.75, 'Azure');
    lGrad.addColorStop(0.75, 'ForestGreen');
    lGrad.addColorStop(1, 'LawnGreen');
    ctx.fillStyle = lGrad;
    ctx.fillRect(0, 0, canvas.width, canvas.height);
}

let lastTimestamp = 0;
const MAX_Y = 350;
function update(timestamp) {
    const deltaTime = timestamp - lastTimestamp;
    lastTimestamp = timestamp;

    pos.y += 0.1 * deltaTime;
    if (pos.y > MAX_Y) pos.y = MAX_Y;

    //Handle user input
    if (input.ArrowRight) pos.x += 0.1 * deltaTime;
    if (input.ArrowLeft) pos.x -= 0.1 * deltaTime;
}

const input = {
    ArrowLeft: false,
    ArrowRight: false,
    ArrowUp: false,
};

document.addEventListener('keydown', function(event) {
    input[event.key] = true;
});
document.addEventListener('keyup', function(event) {
    input[event.key] = false;
});

function draw(timestamp) {
    update(timestamp);

    drawBackground();
    drawPlayer();
    requestAnimationFrame(draw);
}

requestAnimationFrame(draw);


