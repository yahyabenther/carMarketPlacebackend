// src/server.js
const http = require("http");
const { Server } = require("socket.io");
const app = require("./app");
const socketSetup = require("./sockets/chat.socket"); // your chat socket handlers

// Create HTTP server
const server = http.createServer(app);

// ===== Socket.IO setup =====
const io = new Server(server, {
  cors: {
    origin: process.env.FRONTEND_URL,
    credentials: true
  },
  transports: ["polling"] // safe for Railway free tier
});

// Make io accessible in controllers
app.set("io", io);

// Setup socket handlers
socketSetup(io);

// ===== Listen on dynamic port =====
const PORT = process.env.PORT || 3000; // Railway injects PORT
server.listen(PORT, () => {
  console.log(`✅ Server running on port ${PORT}`);
});
