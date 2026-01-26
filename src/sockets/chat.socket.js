
// ===== BACKEND - SOCKET HANDLER =====

// socket/messageSocket.js (or whatever you call it)
module.exports = (io) => {
  io.on("connection", (socket) => {
    console.log("Socket connected:", socket.id);

    // User joins their personal notification room
    socket.on("userOnline", ({ userId }) => {
      socket.join(`user_${userId}`);
      console.log(`User ${userId} joined room: user_${userId}`);
    });

    // User joins a conversation
    socket.on("joinChat", ({ conversationId }) => {
      socket.join(`conversation_${conversationId}`);
      console.log(`Socket ${socket.id} joined: conversation_${conversationId}`);
    });

    // User leaves a conversation
    socket.on("leaveChat", ({ conversationId }) => {
      socket.leave(`conversation_${conversationId}`);
      console.log(`Socket ${socket.id} left: conversation_${conversationId}`);
    });

    socket.on("disconnect", () => {
      console.log("Socket disconnected:", socket.id);
    });
  });
};
