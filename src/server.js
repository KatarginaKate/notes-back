import express from 'express';
import cors from 'cors';
import 'dotenv/config';
import { connectMongoDB } from './db/connectMongoDB.js';
import { logger } from './middleware/logger.js';
import { notFoundHandler } from './middleware/notFoundHandler.js';
import { errors } from 'celebrate';
import { errorHandler } from './middleware/errorHandler.js';
import authRoutes from './routes/authRoutes.js';
import userRoutes from './routes/userRoutes.js';

import notesRoutes from './routes/notesRoutes.js';
import cookieParser from "cookie-parser";

const app = express();
const PORT = process.env.PORT || 3000;

// Middleware
app.use(express.json());
app.use(cors());
app.use(cookieParser());
app.use(logger);
app.use('/notes', notesRoutes);
app.use('/auth', authRoutes);
app.use('/users', userRoutes);

// 404 middleware (після всіх маршрутів)
app.use(notFoundHandler);

app.use(errors());

// error middleware
app.use(errorHandler);

// підключення до MongoDB
await connectMongoDB();

// ONLY ONE listen
app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
});
