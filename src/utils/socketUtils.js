let io;

const initializeSocket = (socketIo) => {
  io = socketIo;
};

const broadcastToRoom = (chatId, event, data) => {
  if (!io) {
    console.warn('Socket.io not initialized');
    return;
  }
  console.log(`Broadcasting ${event} to room ${chatId}:`, data);
  io.to(chatId).emit(event, data);
};

module.exports = {
  initializeSocket,
  broadcastToRoom
}; 