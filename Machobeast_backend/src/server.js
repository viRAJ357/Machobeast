import express from 'express';
import cors from 'cors';
import cookieParser from 'cookie-parser';
import { ENV } from './config/env.js';
import { connectDB } from './config/db.js';
import authRoutes from './routes/auth.routes.js';
import productRoutes from './routes/product.routes.js';
import orderRoutes from './routes/order.routes.js';
import { notFound, errorHandler } from './middlewares/error.middleware.js';

const app = express();

// Middleware configuration
app.use(express.json({ limit: '10mb' }));
app.use(express.urlencoded({ extended: true, limit: '10mb' }));
app.use(cookieParser());

app.use(
  cors({
    origin: (origin, callback) => {
      // Allow requests with no origin (like mobile apps, curl, postman)
      if (!origin) return callback(null, true);
      // Allow localhost, custom CLIENT_URL, and any vercel preview/prod domain
      if (
        origin === ENV.CLIENT_URL ||
        origin.includes('localhost') ||
        origin.endsWith('.vercel.app') ||
        origin.endsWith('.onrender.com')
      ) {
        return callback(null, true);
      }
      return callback(null, true); // Permissive for production deployment
    },
    credentials: true,
    methods: ['GET', 'POST', 'PUT', 'DELETE', 'PATCH', 'OPTIONS'],
    allowedHeaders: ['Content-Type', 'Authorization', 'X-Requested-With']
  })
);

// Health check endpoint
app.get('/api/v1/health', (req, res) => {
  res.status(200).json({
    success: true,
    message: 'MachoBeast API is running'
  });
});

// Mount Routes
app.use('/api/v1/auth', authRoutes);
app.use('/api/v1/products', productRoutes);
app.use('/api/v1/orders', orderRoutes);

// Error Handling Middlewares
app.use(notFound);
app.use(errorHandler);

const PORT = ENV.PORT;

// Start HTTP Server & Connect Database
app.listen(PORT, () => {
  console.log(`[MachoBeast Backend] Server running in ${ENV.NODE_ENV} mode on port ${PORT}`);
  connectDB().catch((err) => {
    console.error(`[MachoBeast DB Warning] MongoDB initial connection failed: ${err.message}`);
  });
});
