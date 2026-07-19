import express from 'express';
import path from 'path';
import cookieParser from 'cookie-parser';
import cors from 'cors';
import authRouter from './routes/auth.routes';
import uploadRoutes from './routes/upload.routes';
import resourceRoutes from './routes/resource.routes';
import { errorHandler } from './middleware/error.middleware';
import userRoutes from './routes/user.routes';
import aiRoutes from './routes/ai.routes';
import chatRoutes from './routes/chat.routes';
import quizRoutes from './routes/quiz.routes';
import dashboardRoutes from './routes/dashboard.routes';
import plannerRoutes from './routes/planner.routes';
const app = express();

app.use(express.json());
app.use(cookieParser());
app.use(cors({
  origin: process.env.CLIENT_URL || 'http://localhost:3000',
  credentials: true
}));

app.use('/uploads', express.static(path.join(__dirname, 'uploads')));

// API Routes — all under /api/v1
app.use('/api/v1/auth', authRouter);
app.use('/api/v1/upload', uploadRoutes);
app.use('/api/v1/resources', resourceRoutes);

// Global Error Handler — must be last, after all routes
app.use(errorHandler);

app.use('/api/v1/users', userRoutes);

app.use('/api/v1/ai', aiRoutes);

app.use('/api/v1/chat', chatRoutes);

app.use('/api/v1/quiz', quizRoutes);
app.use('/api/v1/dashboard', dashboardRoutes);
app.use('/api/v1/planner', plannerRoutes);

export default app;