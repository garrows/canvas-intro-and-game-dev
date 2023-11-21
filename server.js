// Import the express module
const express = require('express');

// Create an express application
const app = express();

const server = require('http').createServer(app);
const io = require('socket.io')(server);

let users = [];
const WIDTH = 800;
const HEIGHT = 450;

io.on('connection', (socket) => {
    console.log('A new challenger approaching', socket.id);
    users.push({
        id: socket.id,
        x: WIDTH / 2,
        y: HEIGHT / 2,
        input: {}
    });

    socket.on('keydown', (key) => {
        user = users.find(user => user.id == socket.id);
        user.input[key] = true;
    });
    socket.on('keyup', (key) => {
        user = users.find(user => user.id == socket.id);
        user.input[key] = false;
    });
    
    
    
    socket.on('disconnect', () => {
        console.log('Goodbye', );
        users = users.filter(user => user.id !== socket.id);
    });
});


const process = require('process');
let lastTimestamp = process.hrtime.bigint();
const MAX_Y = 350;
function loop() {
    update();
    io.emit('users', users);
    setTimeout(loop, 200);
}
loop();


function update() {
    const timestamp = process.hrtime.bigint();
    const deltaTime = Number(timestamp - lastTimestamp) / 1e6; // ms
    lastTimestamp = timestamp;
    users.forEach(user => updateUser(user, deltaTime));
}

function updateUser(user, deltaTime) {
    user.y += 0.1 * Number(deltaTime);
    if (user.y > MAX_Y) user.y = MAX_Y;

    // Handle user input
    if (user.input.ArrowRight) user.x += 0.1 * deltaTime;
    if (user.input.ArrowLeft) user.x -= 0.1 * deltaTime;
    if (user.input.ArrowUp) user.y -= 0.3 * deltaTime;
}


// Use express.static middleware to serve static files
// Here 'public' is the directory name where your static files are stored
app.use(express.static('public'));

const port = process.env.PORT || 3000;
server.listen(port);


