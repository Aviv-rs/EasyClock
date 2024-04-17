const logger = require('./logger.service');
let gIo = null
const { Server } = require('socket.io');
const namespace = '/general';

function setupSocketAPI(http) {
    gIo = new Server(http, {
        path: namespace,
        cors: {
            origin: '*',
        }
    });
    
    gIo.of(namespace).on('connection', async socket => {
        logger.info(`New connected socket [id: ${socket.id}], namespace: ${socket.nsp.name}, first socket ID: ${Object.keys(gIo.of(namespace).sockets)[0]}`);
        socket.channels = {};
        // gIo.sockets.sockets[socket.id] = socket;
        socket.emit('hello', `Current connected sockets: ${gIo.sockets.sockets}]`, gIo.of(namespace).sockets);
        // socket.emit('hello', `New connected socket [id: ${socket.id}]`);
        
        // socket.join('general');
        
        socket.on('disconnect', socket => {
            logger.info(`Socket disconnected [id: ${socket.id}]`);
            socket.emit('disconnect', socket.id);
        });

        socket.on('subscribe', channel => {
            socket.join(channel);
            socket.channels[channel] = channel;
        });

        socket.on('unsubscribe', channel => {
            socket.removeAllListeners("details");
            delete socket.channels[channel];
            gIo.emit('hello', 'user left channel: ' + socket.channels[channel]);
        });
        
        socket.on('user-entered', channel => {
            socket.join(channel);
            socket.channel = channel;
            gIo.emit('hello', 'user has joined channel: ' + socket.channel);
        });
        
        socket.on('client-emit', clientEvent => {
            socket.broadcast.to(clientEvent.channel).emit(clientEvent.event, clientEvent.data);
        });

        socket.on('user-send-message', msg => {
            socket.broadcast.to(socket.channel).emit('new-message', msg);
        });

        socket.on('set-user-socket', userId => {
            logger.info(`Setting socket.userId = ${userId} for socket [id: ${socket.id}]`)
            socket.userId = userId
        });
        socket.on('unset-user-socket', () => {
            logger.info(`Removing socket.userId for socket [id: ${socket.id}]`)
            delete socket.userId
        });

    });

    return gIo;
}

async function _getAllSockets() {
    // return all Socket instances
    // const sockets = gIo.of(namespace).sockets;
    const sockets = await gIo.of(namespace).fetchSockets();
    return sockets;
}

async function _getUserSocket(socketId) {
    const sockets = await _getAllSockets();
    const socket = sockets.find(s => s.socketId === socketId);
    return socket;
}

async function triggerEvent(socketId, clientEvent){
    try {
        const socket = await _getUserSocket(socketId);
        socket.broadcast.to(clientEvent.channel).emit(clientEvent.event, clientEvent.data);
    }
    catch (err) {
        return err;
    }

}



module.exports = {
    // set up the sockets service and define the API
    setupSocketAPI,
    triggerEvent,
    _getAllSockets
    // emit to everyone / everyone in a specific room (label)
    // emitTo,
    // emit to a specific user (if currently active in system)
    // emitToUser,
    // Send to all sockets BUT not the current socket - if found
    // (otherwise broadcast to a room / to all)
//     broadcast,
}