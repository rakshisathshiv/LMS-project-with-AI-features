import express from 'express';
import cors from 'cors';
import dotenv from 'dotenv';
import cookieParser from 'cookie-parser';
import authRoutes from './routes/auth.routes';
import subjectRoutes from './routes/subject.routes';
import progressRoutes from './routes/progress.routes';
import aiRoutes from './routes/ai.routes';

dotenv.config();

const app = express();
const PORT = process.env.PORT || 5000;

// Improved CORS for production and development
const allowedOrigins = [
  'http://localhost:3000',
  process.env.FRONTEND_URL, // Add your Vercel URL here
].filter(Boolean) as string[];

app.use(cors({
  origin: process.env.NODE_ENV === 'production' ? allowedOrigins : true,
  credentials: true
}));

app.use(express.json());
app.use(cookieParser());

// Root routes to prevent 404 on base URLs
app.get('/', (req, res) => {
  res.json({ message: 'LMS API is running', env: process.env.NODE_ENV });
});

app.get('/api', (req, res) => {
  res.json({ message: 'LMS API Root', version: '1.0.0' });
});

app.get('/api/health', (req, res) => {
  res.json({ status: 'OK', timestamp: new Date() });
});

// API Routes
app.use('/api/auth', authRoutes);
app.use('/api/courses', subjectRoutes);
app.use('/api/progress', progressRoutes);
app.use('/api/ai', aiRoutes);

// Export for Vercel
export default app;

// Local development server
if (process.env.NODE_ENV !== 'production') {
  app.listen(PORT, () => {
    console.log(`Backend server running on port ${PORT}`);
  });
}
