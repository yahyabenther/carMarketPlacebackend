const http = require("http");
const { Server } = require("socket.io");
const app = require("./app");
const socketSetup = require("./sockets/chat.socket");

const server = http.createServer(app);



// Create socket.io instance
const io = new Server(server, {
  cors: { origin: "*" }
});

// Make io accessible in controllers
app.set("io", io);

// Setup socket handlers
socketSetup(io);

const PORT = process.env.PORT || 5000;
server.listen(PORT, () => console.log(`Server running on port ${PORT}`));