import express from 'express';
import mongoose from 'mongoose';
import cors from 'cors';
import helmet from 'helmet';
import rateLimit from 'express-rate-limit';
import dotenv from 'dotenv';
import path from 'path';
import { fileURLToPath } from 'url';

// Routes
import authRoutes from './routes/auth.js';
import issueRoutes from './routes/issues.js';
import announcementRoutes from './routes/announcements.js';
import lostFoundRoutes from './routes/lostFound.js';
import analyticsRoutes from './routes/analytics.js';

dotenv.config();

const app = express();

// 🔥 REQUIRED FOR RENDER / PROXY
app.set('trust proxy', 1);

// Security
app.use(helmet());

// CORS (strict, production-safe)
app.use(cors({
  origin: process.env.FRONTEND_URL,
  credentials: true,
}));

app.options('*', cors());

// Rate limit (NOW SAFE)
const limiter = rateLimit({
  windowMs: 15 * 60 * 1000,
  max: 100,
});
app.use('/api', limiter);

// Body parsing
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// MongoDB
mongoose.connect(process.env.MONGODB_URI)
  .then(() => console.log('MongoDB connected'))
  .catch(err => console.error(err));

// Routes
app.use('/api/auth', authRoutes);
app.use('/api/issues', issueRoutes);
app.use('/api/announcements', announcementRoutes);
app.use('/api/lost-found', lostFoundRoutes);
app.use('/api/analytics', analyticsRoutes);

// Health
app.get('/api/health', (req, res) => {
  res.json({ status: 'OK' });
});

// 404
app.use((req, res) => {
  res.status(404).json({ message: 'Route not found' });
});

const PORT = process.env.PORT || 5000;
app.listen(PORT, () => {
  console.log(`Server running on ${PORT}`);
});
