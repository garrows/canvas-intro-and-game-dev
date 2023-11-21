const canvas = document.getElementById('myCanvas');
const ctx = canvas.getContext('2d');
const socket = io();


const audioContext = new AudioContext();
function playJumpSound() {
    const oscillator = audioContext.createOscillator();
    const gainNode = audioContext.createGain();

    oscillator.connect(gainNode);
    gainNode.connect(audioContext.destination);

    const now = audioContext.currentTime;
    oscillator.frequency.setValueAtTime(440, now);
    oscillator.frequency.exponentialRampToValueAtTime(110, now + 0.1);

    gainNode.gain.setValueAtTime(1, now);
    gainNode.gain.exponentialRampToValueAtTime(0.01, now + 0.1);

    oscillator.start(now);
    oscillator.stop(now + 0.1);
}


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

let users = [];
socket.on('users', (newUsers) => {
    users = newUsers;
});

function drawPlayer(user) {
    const {x, y} = user;
    const {w, h} = pos;
    ctx.fillStyle = 'black';
    ctx.fillRect(x - w / 2, y - h / 2, w, h);
    
    // Draw a border around the player
    ctx.lineWidth = '10';
    ctx.strokeStyle = 'rgb(100, 0, 0)';
    ctx.lineJoin = 'round';
    ctx.strokeRect(x - w / 2, y - h / 2, w, h);
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

    const myPlayer = users.find(u => u.id === socket.id);
    if (!myPlayer) return;

    myPlayer.y += 0.1 * deltaTime;
    if (myPlayer.y > MAX_Y) myPlayer.y = MAX_Y;

    // //Handle user input
    if (input.ArrowRight) myPlayer.x += 0.1 * deltaTime;
    if (input.ArrowLeft) myPlayer.x -= 0.1 * deltaTime;
}

const input = {
    ArrowLeft: false,
    ArrowRight: false,
    ArrowUp: false,
};

document.addEventListener('keydown', function(event) {
    input[event.key] = true;
    socket.emit('keydown', event.key);
    if (event.key === 'ArrowUp') {
        playJumpSound();

        // const myPlayer = users.find(u => u.id === socket.id);
        // if (!myPlayer) return;
        // myPlayer.y -= 100;
    }
});
document.addEventListener('keyup', function(event) {
    input[event.key] = false;
    socket.emit('keyup', event.key);
});

function draw(timestamp) {
    update(timestamp);

    drawBackground();
    users.forEach(user => {
        drawPlayer(user);
    })
    requestAnimationFrame(draw);
}

requestAnimationFrame(draw);


