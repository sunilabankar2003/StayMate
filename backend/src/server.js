const http = require('http');
const dotenv = require('dotenv');

// Load environment variables
dotenv.config();

const app = require('./app');
const connectDB = require('./config/db');
const setupChatSocket = require('./sockets/chatSocket');
const { Server } = require('socket.io');

const PORT = process.env.PORT || 5000;

// Connect to Database
connectDB();

// Create HTTP server
const server = http.createServer(app);

// Setup Socket.IO
const io = new Server(server, {
  cors: {
    origin: [
      'http://localhost:5173',
      'http://127.0.0.1:5173',
      process.env.FRONTEND_URL,
    ].filter(Boolean),
    credentials: true,
  },
});

// Pass io to Express app for use in controllers
app.set('io', io);

// Initialize chat socket handlers
setupChatSocket(io);

// Start server
server.listen(PORT, () => {
  console.log(`=========================================`);
  console.log(` StayMate API Server running on port ${PORT}`);
  console.log(` Environment: ${process.env.NODE_ENV || 'development'}`);
  console.log(` Socket.IO Real-time server active`);
  console.log(`=========================================`);
});

// Handle unhandled promise rejections
process.on('unhandledRejection', (err) => {
  console.error(`Unhandled Rejection Error: ${err.message}`);
  // Keep server alive in development
});
