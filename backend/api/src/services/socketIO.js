const { Server } = require('socket.io');

let io;

function initSocket(server, corsOrigin = 'http://localhost:4200') {
  io = new Server(server, {
    cors: {
      origin: corsOrigin
    }
  });

  io.on('connection', (socket) => {
    console.log('Cliente conectado:', socket.id);

    socket.on('join-job', (jobId) => {
      socket.join(jobId);

      console.log(
        `Socket ${socket.id} entrou no job ${jobId}`
      );
    });

    socket.on('disconnect', () => {
      console.log('Cliente desconectado:', socket.id);
    });
  });

  return io;
}

function getIO() {
  if (!io) {
    throw new Error('Socket.IO não foi inicializado');
  }

  return io;
}

module.exports = {
  initSocket,
  getIO
};