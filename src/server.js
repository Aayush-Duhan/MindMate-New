const express = require('express');
const cors = require('cors');
const helmet = require('helmet');
const rateLimit = require('express-rate-limit');
const xss = require('xss-clean');
const mongoSanitize = require('express-mongo-sanitize');
const hpp = require('hpp');
const connectDB = require('./config/db');
require('dotenv').config();
const http = require('http');
const socketIO = require('socket.io');
const jwt = require('jsonwebtoken');
const Chat = require('./models/Chat');
const mongoose = require('mongoose');
const { initializeSocket } = require('./utils/socketUtils');

const app = express();
const server = http.createServer(app);

let io;

// Handle server errors
server.on('error', (error) => {
  if (error.code === 'EADDRINUSE') {
    console.error(`Port ${PORT} is already in use. Please use a different port or kill the process using this port.`);
  } else {
    console.error('Server error:', error);
  }
  process.exit(1);
});

// Socket.io setup
io = socketIO(server, {
  cors: {
    origin: process.env.CLIENT_URL || "http://localhost:3000",
    methods: ["GET", "POST"],
    credentials: true
  }
});

// Initialize socket utilities
initializeSocket(io);

// Connect to MongoDB
connectDB();

// Middleware
app.use(express.json({ limit: '10kb' }));
app.use(mongoSanitize());
app.use(xss());
app.use(hpp());

app.use((req, res, next) => {
  res.setHeader(
    'Content-Security-Policy',
    "default-src 'self'; script-src 'self' 'unsafe-inline' 'unsafe-eval'; style-src 'self' 'unsafe-inline' https://fonts.googleapis.com; font-src 'self' https://fonts.gstatic.com; img-src 'self' data: https:; connect-src 'self' https://api.openai.com " + process.env.LANGFLOW_API_URL
  );
  next();
});

// Trust proxy configuration for rate limiting behind reverse proxies
app.set('trust proxy', 1);

// Rate limiting configuration
const limiter = rateLimit({
  windowMs: 15 * 60 * 1000, // 15 minutes
  max: 100, // Limit each IP to 100 requests per windowMs
  standardHeaders: true, // Return rate limit info in the `RateLimit-*` headers
  legacyHeaders: false // Disable the `X-RateLimit-*` headers
});

// CORS configuration
app.use(cors({
  origin: process.env.CLIENT_URL || "http://localhost:3000",
  credentials: true,
  methods: ['GET', 'POST', 'PUT', 'PATCH', 'DELETE', 'OPTIONS'],
  allowedHeaders: ['Content-Type', 'Authorization']
}));

// Apply rate limiter to all routes
app.use(limiter);

// Create separate limiter for chat routes with higher limits
const chatLimiter = rateLimit({
  windowMs: 1 * 60 * 1000, // 1 minute
  max: 100, // 100 requests per minute
  message: { 
    success: false, 
    message: 'Too many chat requests, please try again later.' 
  }
});

// Apply chat-specific rate limiting
app.use('/api/anonymous-chat/', chatLimiter);

// Import routes
const authRoutes = require('./routes/auth.routes');
const goalRoutes = require('./routes/goal.routes');
const resourceRoutes = require('./routes/resource.routes');
const progressRoutes = require('./routes/progress.routes');
const chatRoutes = require('./routes/chat.routes');
const moodRoutes = require('./routes/mood.routes');
const schoolRoutes = require('./routes/school.routes');
const mentalHealthRoutes = require('./routes/mentalHealth.routes');
const anonymousChatRoutes = require('./routes/anonymousChat.routes');
const analyticsRoutes = require('./routes/analytics.routes');
const userRoutes = require('./routes/user.routes');
const quotesRoutes = require('./routes/quotes.routes');
const profileRoutes = require('./routes/profile.routes');
const settingsRoutes = require('./routes/settings.routes');
const adminRoutes = require('./routes/admin.routes');

// Mount routes
app.use('/api/auth', authRoutes);
app.use('/api/goals', goalRoutes);
app.use('/api/resources', resourceRoutes);
app.use('/api/progress', progressRoutes);
app.use('/api/chat', chatRoutes);
app.use('/api/mood', moodRoutes);
app.use('/api/schools', schoolRoutes);
app.use('/api/records', mentalHealthRoutes);
app.use('/api/anonymous-chat', anonymousChatRoutes);
app.use('/api/analytics', analyticsRoutes);
app.use('/api/users', userRoutes);
app.use('/api/quotes', quotesRoutes);
app.use('/api/profile', profileRoutes);
app.use('/api/admin/settings', settingsRoutes);
app.use('/api/admin', adminRoutes);

// Make io available to routes
app.use((req, res, next) => {
  req.io = io;
  next();
});

// Socket.io connection handling
io.on('connection', (socket) => {
  console.log('New client connected');

  // Get user info from token
  const token = socket.handshake.auth.token;
  let userId = 'anonymous';
  
  if (token) {
    try {
      const decoded = jwt.verify(token, process.env.JWT_SECRET);
      userId = decoded.id;
      socket.userId = userId;
      console.log('Authenticated user connected:', userId);
    } catch (error) {
      console.error('Token verification failed:', error);
    }
  }

  // Store active chat rooms for this socket
  const activeRooms = new Set();

  // Join chat room
  socket.on('joinChat', (chatId) => {
    console.log(`User ${userId} joining chat ${chatId}`);
    socket.join(chatId);
    activeRooms.add(chatId);
  });

  // Handle new message
  socket.on('sendMessage', async (data) => {
    const { chatId, message } = data;
    
    if (!activeRooms.has(chatId)) {
      console.warn(`Attempt to send message to inactive room ${chatId}`);
      return;
    }

    // Broadcast the message to all clients in the room
    io.in(chatId).emit('newMessage', {
      chatId,
      message
    });
  });

  // Leave chat room
  socket.on('leaveChat', (chatId) => {
    console.log(`User ${userId} leaving chat ${chatId}`);
    socket.leave(chatId);
    activeRooms.delete(chatId);
  });

  socket.on('disconnect', () => {
    console.log('Client disconnected:', userId);
    // Clean up active rooms
    activeRooms.clear();
  });
});

// Health check endpoint
app.get('/api/health', async (req, res) => {
  try {
    // Check MongoDB connection
    const isConnected = mongoose.connection.readyState === 1;
    
    res.json({
      status: 'ok',
      mongodb: isConnected ? 'connected' : 'disconnected',
      uptime: process.uptime(),
      timestamp: new Date()
    });
  } catch (error) {
    res.status(500).json({
      status: 'error',
      error: error.message
    });
  }
});

const PORT = process.env.PORT || 5000;

server.listen(PORT, '0.0.0.0', () => {
  console.log(`Server running on port ${PORT}`);
});

// Handle process errors
process.on('uncaughtException', (error) => {
  console.error('Uncaught Exception:', error);
  process.exit(1);
});

process.on('unhandledRejection', (error) => {
  console.error('Unhandled Rejection:', error);
  process.exit(1);
});

// Export io instance if needed elsewhere
module.exports = { io }; 