require('dotenv').config();
const express = require('express');
const cors = require('cors');
const path = require('path');
const sequelize = require('./config/database');

// ── Models (import to register with Sequelize) ─────────
const User = require('./models/User');
const Payment = require('./models/Payment');
const LearningModule = require('./models/LearningModule');
const {
  Assessment, AssessmentAttempt, Submission, Feedback,
  Certificate, Portfolio, PortfolioItem, Message,
  MentorshipSession, ProgressReport, LearnerModule,
} = require('./models/index');

// ── Routes ─────────────────────────────────────────────
const authRoutes    = require('./routes/auth');
const paymentRoutes = require('./routes/payments');
const moduleRoutes  = require('./routes/modules');
const adminRoutes   = require('./routes/admin');
const submissionRoutes = require('./routes/resources');
const {
  portfolioRouter,
  messageRouter,
  sessionRouter,
  progressRouter,
} = require('./routes/resources');

const app = express();
const PORT = process.env.PORT || 5000;

// ── Middleware ─────────────────────────────────────────
app.use(cors({
  origin: process.env.FRONTEND_URL || 'http://localhost:3000',
  credentials: true,
}));
app.use(express.json({ limit: '10mb' }));
app.use(express.urlencoded({ extended: true }));

// Serve uploaded files
app.use('/uploads', express.static(path.join(__dirname, 'uploads')));

// ── API Routes ─────────────────────────────────────────
app.use('/api/auth',        authRoutes);
app.use('/api/payments',    paymentRoutes);
app.use('/api/modules',     moduleRoutes);
app.use('/api/submissions', submissionRoutes);
app.use('/api/portfolios',  portfolioRouter);
app.use('/api/messages',    messageRouter);
app.use('/api/sessions',    sessionRouter);
app.use('/api/progress',    progressRouter);
app.use('/api/admin',       adminRoutes);

// ── Health check ───────────────────────────────────────
app.get('/api/health', (req, res) => {
  res.json({ status: 'ok', timestamp: new Date().toISOString() });
});

// ── Global error handler ───────────────────────────────
app.use((err, req, res, next) => {
  console.error('Unhandled error:', err.stack);
  res.status(500).json({ message: 'Something went wrong on the server.' });
});

// ── Boot: sync DB then start server ────────────────────
const start = async () => {
  try {
    await sequelize.authenticate();
    console.log('✓ Database connected');

    // alter: true updates columns without dropping data
    await sequelize.sync({ alter: true });
    console.log('✓ Database synced');

    // Create uploads directories if they don't exist
    const fs = require('fs');
    ['uploads/photos', 'uploads/modules', 'uploads/submissions', 'uploads/certificates']
      .forEach((dir) => fs.mkdirSync(path.join(__dirname, dir), { recursive: true }));

    app.listen(PORT, () => {
      console.log(`✓ Server running on http://localhost:${PORT}`);
      console.log(`  Environment: ${process.env.NODE_ENV || 'development'}`);
    });
  } catch (err) {
    console.error('Failed to start server:', err);
    process.exit(1);
  }
};

start();
