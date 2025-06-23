import express from 'express';
import cors from 'cors';
import helmet from 'helmet';
import morgan from 'morgan';
import compression from 'compression';
import dotenv from 'dotenv';
import path from 'path';

// Import middleware
import { errorHandler, notFoundHandler } from '@/middleware/errorHandler';
import { generalLimiter } from '@/middleware/rateLimiter';

// Import routes
import authRoutes from '@/routes/auth';
import memberRoutes from '@/routes/members';

// Import utilities
import { logger } from '@/utils/logger';
import { AuthUtils } from '@/utils/auth';
import DatabaseConnection from '@/database/connection';
import migrate from '@/database/migrate';

// Load environment variables
dotenv.config();

const app = express();
const PORT = process.env.PORT ? Number(process.env.PORT) : 3001;
const HOST = process.env.HOST || 'localhost';

// Security middleware
app.use(helmet({
  crossOriginResourcePolicy: { policy: "cross-origin" }
}));

// CORS configuration
app.use(cors({
  origin: process.env.CORS_ORIGIN || 'http://localhost:8080',
  credentials: true,
  methods: ['GET', 'POST', 'PUT', 'DELETE', 'OPTIONS'],
  allowedHeaders: ['Content-Type', 'Authorization']
}));

// Body parsing middleware
app.use(express.json({ limit: '10mb' }));
app.use(express.urlencoded({ extended: true, limit: '10mb' }));

// Compression middleware
app.use(compression());

// Logging middleware
if (process.env.NODE_ENV !== 'test') {
  app.use(morgan('combined', {
    stream: {
      write: (message: string) => logger.info(message.trim())
    }
  }));
}

// Rate limiting
app.use(generalLimiter);

// Health check endpoint
app.get('/health', (req, res) => {
  res.status(200).json({
    success: true,
    message: 'Server is healthy',
    timestamp: new Date().toISOString(),
    uptime: process.uptime()
  });
});

// API routes
app.use('/api/auth', authRoutes);
app.use('/api/members', memberRoutes);

// Serve static files in production
if (process.env.NODE_ENV === 'production') {
  app.use(express.static(path.join(__dirname, '../public')));
  
  app.get('*', (req, res) => {
    res.sendFile(path.join(__dirname, '../public/index.html'));
  });
}

// Error handling middleware
app.use(notFoundHandler);
app.use(errorHandler);

// Graceful shutdown
process.on('SIGTERM', async () => {
  logger.info('SIGTERM received, shutting down gracefully');
  
  try {
    const db = DatabaseConnection.getInstance();
    await db.close();
    logger.info('Database connection closed');
  } catch (error) {
    logger.error('Error during shutdown', error);
  }
  
  process.exit(0);
});

process.on('SIGINT', async () => {
  logger.info('SIGINT received, shutting down gracefully');
  
  try {
    const db = DatabaseConnection.getInstance();
    await db.close();
    logger.info('Database connection closed');
  } catch (error) {
    logger.error('Error during shutdown', error);
  }
  
  process.exit(0);
});

// Cleanup expired tokens periodically
setInterval(async () => {
  try {
    await AuthUtils.cleanupExpiredTokens();
    logger.debug('Expired tokens cleaned up');
  } catch (error) {
    logger.error('Failed to cleanup expired tokens', error);
  }
}, 24 * 60 * 60 * 1000); // Run daily

// Initialize database and start server
async function startServer() {
  try {
    // Run database migrations
    await migrate();
    logger.info('Database migrations completed');

    // Start server
    app.listen(PORT, HOST, () => {
      logger.info(`Server running on http://${HOST}:${PORT}`);
      logger.info(`Environment: ${process.env.NODE_ENV || 'development'}`);
    });
  } catch (error) {
    logger.error('Failed to start server', error);
    process.exit(1);
  }
}

// Start the server
startServer();

export default app;