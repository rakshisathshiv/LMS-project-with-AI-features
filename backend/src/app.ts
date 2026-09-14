import express from 'express';
import cors from 'cors';
import dotenv from 'dotenv';
import cookieParser from 'cookie-parser';
import authRoutes from './routes/auth.routes';
import subjectRoutes from './routes/subject.routes';
import progressRoutes from './routes/progress.routes';
import aiRoutes from './routes/ai.routes';

dotenv.config();

const requiredEnv = ['JWT_ACCESS_SECRET', 'JWT_REFRESH_SECRET'] as const;
for (const key of requiredEnv) {
  if (!process.env[key]) {
    console.error(
      `[config] Missing ${key}. Copy backend/.env.example to backend/.env and set JWT secrets.`
    );
    process.exit(1);
  }
}

const app = express();

const allowedOrigins = [
  'http://localhost:3000',
  process.env.FRONTEND_URL,
].filter(Boolean) as string[];

app.use(
  cors({
    origin: process.env.NODE_ENV === 'production' ? allowedOrigins : true,
    credentials: true,
  })
);

app.use(express.json());
app.use(cookieParser());

app.get('/', (req, res) => {
  res.json({ message: 'LMS API is running', env: process.env.NODE_ENV });
});

app.get('/api', (req, res) => {
  res.json({ message: 'LMS API Root', version: '1.0.0' });
});

app.get('/api/health', (req, res) => {
  res.json({ status: 'OK', timestamp: new Date() });
});

app.use('/api/auth', authRoutes);
app.use('/api/courses', subjectRoutes);
app.use('/api/progress', progressRoutes);
app.use('/api/ai', aiRoutes);

export default app;
