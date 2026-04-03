import 'dotenv/config';
import express from 'express';
import cors from 'cors';
import { createServer } from 'http';
import { Server } from 'socket.io';

import connectDB from './config/db.js';
import errorHandler from './middleware/errorHandler.js';

// Routes
import authRoutes from './routes/authRoutes.js';
import userRoutes from './routes/userRoutes.js';
import gigRoutes from './routes/gigRoutes.js';
import orderRoutes from './routes/orderRoutes.js';
import reviewRoutes from './routes/reviewRoutes.js';
import challengeRoutes from './routes/challengeRoutes.js';
import messageRoutes from './routes/messageRoutes.js';

// Models (for socket usage)
import Message from './models/Message.js';
import Order from './models/Order.js';

// ─── Connect to DB ──────────────────────────────────────────────────────────
connectDB();

const app = express();
const httpServer = createServer(app);

// ─── Socket.io ──────────────────────────────────────────────────────────────
const io = new Server(httpServer, {
  cors: {
    origin: process.env.CLIENT_URL || 'http://localhost:3000',
    methods: ['GET', 'POST'],
  },
});

io.on('connection', (socket) => {
  console.log(`🔌 Socket connected: ${socket.id}`);

  // Join a room for a specific order
  socket.on('join_order', (orderId) => {
    socket.join(orderId);
    console.log(`   Socket ${socket.id} joined room: ${orderId}`);
  });

  // Handle new messages
  socket.on('send_message', async ({ orderId, senderId, content }) => {
    try {
      const order = await Order.findById(orderId);
      if (!order) return;

      const isParticipant =
        order.buyerId.toString() === senderId || order.sellerId.toString() === senderId;

      if (!isParticipant) return;

      const message = await Message.create({ sender: senderId, orderId, content });
      const populated = await message.populate('sender', 'name profile.avatarUrl');

      // Broadcast to both parties in the room
      io.to(orderId).emit('new_message', populated);
    } catch (err) {
      console.error('Socket message error:', err.message);
    }
  });

  socket.on('disconnect', () => {
    console.log(`🔌 Socket disconnected: ${socket.id}`);
  });
});

// ─── Middleware ──────────────────────────────────────────────────────────────
app.use(
  cors({
    origin: process.env.CLIENT_URL || 'http://localhost:3000',
    credentials: true,
  })
);
app.use(express.json({ limit: '10mb' }));
app.use(express.urlencoded({ extended: true, limit: '10mb' }));

// ─── Routes ─────────────────────────────────────────────────────────────────
app.use('/api/auth', authRoutes);
app.use('/api/users', userRoutes);
app.use('/api/gigs', gigRoutes);
app.use('/api/orders', orderRoutes);
app.use('/api/reviews', reviewRoutes);
app.use('/api/challenges', challengeRoutes);
app.use('/api/messages', messageRoutes);

// Health check
app.get('/api/health', (req, res) =>
  res.json({ success: true, message: 'Hustlr API is running 🚀' })
);

// ─── Error Handler ───────────────────────────────────────────────────────────
app.use(errorHandler);

// ─── Start Server ────────────────────────────────────────────────────────────
const PORT = process.env.PORT || 5000;
httpServer.listen(PORT, () => {
  console.log(`\n🚀 Hustlr server running on http://localhost:${PORT}`);
  console.log(`🌍 Environment: ${process.env.NODE_ENV}`);
});
