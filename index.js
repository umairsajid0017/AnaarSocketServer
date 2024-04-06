const http = require('http');
const socketIo = require('socket.io');

const server = http.createServer((req, res) => {
    res.end('Socket.IO server is running!');
});

const io = socketIo(server);

io.on('connection', (socket) => {
    console.log('A user connected');
    
    socket.on('disconnect', () => {
        console.log('User disconnected');
    });
    
    socket.on('chat message', (msg) => {
        console.log('Message:', msg);
        io.emit('chat message', msg);
    });
});

const PORT = process.env.PORT || 3000;
server.listen(PORT, () => {
    console.log(`Socket.IO server listening on port ${PORT}`);
});
