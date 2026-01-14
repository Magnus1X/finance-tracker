const express = require('express');
const cors = require('cors');
const dotenv = require('dotenv');
const { connectDB, disconnectDB } = require('./config/database');
const errorHandler = require('./middleware/errorHandler');

// Load environment variables
dotenv.config();

// Import routes
const authRoutes = require('./routes/authRoutes');
const transactionRoutes = require('./routes/transactionRoutes');
const budgetRoutes = require('./routes/budgetRoutes');
const aiRoutes = require('./routes/aiRoutes');

// Initialize Express app
const app = express();

// Connect to database
connectDB();

// Middleware
app.use(cors({
  origin: process.env.FRONTEND_URL?.split(',') || ['http://localhost:3000'],
  credentials: true,
}));

app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// Routes
app.get('/', (req, res) => {
  res.json({
    success: true,
    message: 'Finance Tracker API',
    version: '1.0.0',
    endpoints: {
      health: '/api/health',
      auth: '/api/auth',
      transactions: '/api/transactions',
      budgets: '/api/budgets',
      ai: '/api/ai'
    }
  });
});

app.use('/api/auth', authRoutes);
app.use('/api/transactions', transactionRoutes);
app.use('/api/budgets', budgetRoutes);
app.use('/api/ai', aiRoutes);

// Health check
app.get('/api/health', (req, res) => {
  res.json({
    success: true,
    message: 'Finance Tracker API is running',
    timestamp: new Date().toISOString(),
  });
});

// Error handler (must be last)
app.use(errorHandler);

// Start server
const PORT = process.env.PORT || 5000;

const server = app.listen(PORT, '0.0.0.0', () => {
  console.log(`🚀 Server running on port ${PORT}`);
  console.log(`📊 Environment: ${process.env.NODE_ENV || 'development'}`);
});

// Graceful shutdown
process.on('SIGTERM', async () => {
  console.log('SIGTERM signal received: closing HTTP server');
  server.close(async () => {
    await disconnectDB();
    process.exit(0);
  });
});

process.on('SIGINT', async () => {
  console.log('SIGINT signal received: closing HTTP server');
  server.close(async () => {
    await disconnectDB();
    process.exit(0);
  });
});

module.exports = app;

