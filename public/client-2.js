const canvas = document.getElementById('myCanvas');
const ctx = canvas.getContext('2d');

var pos = {
    x: canvas.width / 2,
    y: canvas.height / 2,
    w: 40,
    h: 40
};

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
}

function draw(timestamp) {
    update(timestamp);

    drawBackground();
    drawPlayer();
    requestAnimationFrame(draw);
}

requestAnimationFrame(draw);


