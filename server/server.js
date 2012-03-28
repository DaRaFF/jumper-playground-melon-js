var io = require('socket.io').listen(8081);

io.sockets.on('connection', function (socket) {

    socket.on('message', function (message) {
        socket.broadcast.emit('message', message);
    });

});