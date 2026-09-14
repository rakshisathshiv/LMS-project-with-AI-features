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

function buildAllowedOrigins(): string[] {
  const fromEnv = (process.env.ALLOWED_ORIGINS || '')
    .split(',')
    .map((o) => o.trim())
    .filter(Boolean);
  return [
    'http://localhost:3000',
    process.env.FRONTEND_URL,
    ...fromEnv,
  ].filter(Boolean) as string[];
}

const allowedOrigins = buildAllowedOrigins();

app.use(
  cors({
    origin(origin, callback) {
      if (process.env.NODE_ENV !== 'production') {
        callback(null, true);
        return;
      }
      if (!origin) {
        callback(null, true);
        return;
      }
      if (allowedOrigins.includes(origin)) {
        callback(null, true);
        return;
      }
      if (
        process.env.ALLOW_VERCEL_PREVIEWS !== 'false' &&
        /^https:\/\/[\w-]+\.vercel\.app$/.test(origin)
      ) {
        callback(null, true);
        return;
      }
      callback(new Error(`CORS blocked for origin: ${origin}`));
    },
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
