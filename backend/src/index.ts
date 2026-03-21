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

app.use(cors({ origin: 'http://localhost:3000', credentials: true }));
app.use(express.json());
app.use(cookieParser());

app.get('/api/health', (req, res) => {
  res.json({ status: 'OK', timestamp: new Date() });
});

app.use('/api/auth', authRoutes);
app.use('/api/courses', subjectRoutes);
app.use('/api/progress', progressRoutes);
app.use('/api/ai', aiRoutes);

app.listen(PORT, () => {
  console.log(`Backend server running on port ${PORT}`);
});
