import express from 'express';
import cors from 'cors';
import dotenv from 'dotenv';
import { connectMongoDB } from './db/connectMongoDB.js';
import { logger } from './middleware/logger.js';
import { notFoundHandler } from './middleware/notFoundHandler.js';
import { errorHandler } from './middleware/errorHandler.js';

import notesRoutes from './routes/notesRoutes.js';

dotenv.config();

const app = express();
const PORT = process.env.PORT || 3000;

// Middleware
app.use(express.json());
app.use(cors());
app.use(logger);
app.use('/notes', notesRoutes);

// 404 middleware (після всіх маршрутів)
app.use(notFoundHandler);

// error middleware
app.use(errorHandler);

// підключення до MongoDB
await connectMongoDB();

// ONLY ONE listen
app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
});
