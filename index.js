const http = require('http');
const socketIo = require('socket.io');

const server = http.createServer((req, res) => {
    res.end('Socket.IO server is running!');
});


const io = socketIo(server);

const branchIds = new Map(); //convert it into map key,value pair

io.on('connection', (socket) => {
    const branchId = socket.handshake.query.branchId;
    if (!branchIds.has(branchId)) {
        branchIds.set(branchId, new Set());
    }
    branchIds.set(branchId, socket.id);
    console.log(`User ${socket.id} joined branch ${branchId}`);
    console.log(branchIds);
    
    socket.on('disconnect', () => {
        console.log('User disconnected');
    });
    
    socket.on('notification', (msg) => {
        const parsedMsg = JSON.parse(msg);
        const branchId = parsedMsg.branchId;
        console.log('Json:', parsedMsg, branchId);
        const socketId = branchIds.get(branchId);
        if (socketId) {
            io.to(socketId).emit('orderReceived', msg);
            console.log('notification sent to ' + socketId,msg);
        }
    });
});

const PORT = process.env.PORT || 3000;
server.listen(PORT, () => {
    console.log(`Socket.IO server listening on port ${PORT}`);
});
