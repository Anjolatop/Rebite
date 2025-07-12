import express from 'express';
import cors from 'cors';
import helmet from 'helmet';
import morgan from 'morgan';
import compression from 'compression';
import { createServer } from 'http';
import { Server } from 'socket.io';
import dotenv from 'dotenv';
import rateLimit from 'express-rate-limit';

// Import routes
import authRoutes from './routes/auth';
import userRoutes from './routes/users';
import vendorRoutes from './routes/vendors';
import listingRoutes from './routes/listings';
import orderRoutes from './routes/orders';
import pointsRoutes from './routes/points';
import recipeRoutes from './routes/recipes';
import ussdRoutes from './routes/ussd';

// Import middleware
import { authenticateToken } from './middleware/auth';
import { errorHandler } from './middleware/errorHandler';

// Import services
import { initializeDatabase } from './config/database';
import { initializeRedis } from './config/redis';
import { initializeSocketIO } from './services/socketService';

// Load environment variables
dotenv.config();

const app = express();
const server = createServer(app);
const io = new Server(server, {
  cors: {
    origin: process.env.FRONTEND_URL || "http://localhost:3000",
    methods: ["GET", "POST"]
  }
});

// Rate limiting
const limiter = rateLimit({
  windowMs: 15 * 60 * 1000, // 15 minutes
  max: 100, // limit each IP to 100 requests per windowMs
  message: 'Too many requests from this IP, please try again later.'
});

// Middleware
app.use(helmet());
app.use(cors({
  origin: process.env.FRONTEND_URL || "http://localhost:3000",
  credentials: true
}));
app.use(compression());
app.use(morgan('combined'));
app.use(express.json({ limit: '10mb' }));
app.use(express.urlencoded({ extended: true, limit: '10mb' }));
app.use(limiter);

// Health check endpoint
app.get('/health', (req, res) => {
  res.json({ 
    status: 'OK', 
    timestamp: new Date().toISOString(),
    version: process.env.npm_package_version || '1.0.0'
  });
});

// API Routes
app.use('/api/auth', authRoutes);
app.use('/api/users', authenticateToken, userRoutes);
app.use('/api/vendors', authenticateToken, vendorRoutes);
app.use('/api/listings', listingRoutes);
app.use('/api/orders', authenticateToken, orderRoutes);
app.use('/api/points', authenticateToken, pointsRoutes);
app.use('/api/recipes', recipeRoutes);
app.use('/api/ussd', ussdRoutes);

// Error handling middleware
app.use(errorHandler);

// 404 handler
app.use('*', (req, res) => {
  res.status(404).json({ 
    error: 'Route not found',
    path: req.originalUrl 
  });
});

// Initialize services
const initializeApp = async () => {
  try {
    // Initialize database
    let dbConnected = false;
    try {
      await initializeDatabase();
      console.log('✅ Database connected');
      dbConnected = true;
    } catch (error) {
      console.log('⚠️  Database not available, continuing without database...');
    }

    // Initialize Redis
    let redisConnected = false;
    try {
      await initializeRedis();
      console.log('✅ Redis connected');
      redisConnected = true;
    } catch (error) {
      console.log('⚠️  Redis not available, continuing without Redis...');
    }

    // Initialize Socket.IO
    initializeSocketIO(io);
    console.log('✅ Socket.IO initialized');

    const PORT = process.env.PORT || 8000;
    server.listen(PORT, () => {
      console.log(`🚀 Rebite Backend Server running on port ${PORT}`);
      console.log(`📱 Health check: http://localhost:${PORT}/health`);
      console.log(`🔗 API Base URL: http://localhost:${PORT}/api`);
      if (!dbConnected || !redisConnected) {
        console.log(`💡 To start with database, run: docker compose up -d postgres redis`);
        console.log(`💡 Install Docker Desktop from: https://www.docker.com/products/docker-desktop/`);
      }
    });
  } catch (error) {
    console.error('❌ Failed to initialize app:', error);
    process.exit(1);
  }
};

// Handle graceful shutdown
process.on('SIGTERM', () => {
  console.log('SIGTERM received, shutting down gracefully');
  server.close(() => {
    console.log('Process terminated');
  });
});

process.on('SIGINT', () => {
  console.log('SIGINT received, shutting down gracefully');
  server.close(() => {
    console.log('Process terminated');
  });
});

// Start the application
initializeApp(); 