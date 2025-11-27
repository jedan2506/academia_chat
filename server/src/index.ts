import express from 'express';
import cors from 'cors';
import dotenv from 'dotenv';
import connectDB from './config/database';
import authRoutes from './routes/auth';
import chatRoutes from './routes/chat';
import { errorHandler } from './middleware/errorHandler';
import { generalLimiter } from './middleware/rateLimiter';

dotenv.config();

const app = express();
const PORT = process.env.PORT;

connectDB();

app.use(cors({
    origin: process.env.CLIENT_URL || 'http://localhost:3100',
    credentials: true,
}));

app.use('/api/', generalLimiter);

app.use(express.json());
app.use(express.urlencoded({ extended: true }));

app.use('/api/auth', authRoutes);
app.use('/api/chat', chatRoutes);

app.get('/', (req, res) => {
    res.json({ message: 'Server is running!', timestamp: new Date().toISOString() });
});

app.use(errorHandler);

if (process.env.NODE_ENV !== 'production' || !process.env.VERCEL) {
app.listen(PORT, () => {
    console.log(`Server is running on port ${PORT}`);
});
}

export default app;
