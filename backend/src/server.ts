import express from 'express';
import cors from 'cors';
import mongoose from 'mongoose';
import dotenv from 'dotenv';
import userRoutes from './routes/userRoutes';
import visitorRoutes from './routes/visitorRoutes';
import connectDB from './config/database';

dotenv.config();

const app = express();

// Middleware
app.use(cors({
  origin: true, // Allow all origins in development
  credentials: true
}));
app.use(express.json());

// Root route for health check and API info
app.get('/', (req, res) => {
  res.json({
    status: 'ok',
    message: 'Visitor Management System API',
    version: '1.0.0',
    endpoints: {
      users: '/api/users',
      visitors: '/api/visitors'
    }
  });
});

// Routes
app.use('/api/users', userRoutes);
app.use('/api/visitors', visitorRoutes);

// Connect to MongoDB
const startServer = async () => {
  try {
    await connectDB();
    
    const PORT = 3001; // Force port 3001
    const server = app.listen(PORT, '0.0.0.0', () => {
      console.log(`Server is running on port ${PORT}`);
      console.log(`Local: http://localhost:${PORT}`);
      console.log(`Network: http://192.168.1.61:${PORT}`);
    }).on('error', (err: Error & { code?: string }) => {
      if (err.code === 'EADDRINUSE') {
        console.error(`Port ${PORT} is already in use. Please try a different port or kill the process using this port.`);
        process.exit(1);
      } else {
        console.error('Server error:', err);
        process.exit(1);
      }
    });

    // Handle graceful shutdown
    process.on('SIGTERM', () => {
      console.log('SIGTERM signal received: closing HTTP server');
      server.close(() => {
        console.log('HTTP server closed');
        mongoose.connection.close().then(() => {
          console.log('MongoDB connection closed');
          process.exit(0);
        });
      });
    });
  } catch (error) {
    console.error('Failed to start server:', error);
    process.exit(1);
  }
};

startServer(); 