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
import swaggerUi from 'swagger-ui-express';
import { swaggerSpec } from './docs/swagger.js';

const app = express();
const PORT = process.env.PORT || 3000;
const frontendOrigin = process.env.FRONTEND_DOMAIN || 'http://localhost:5173';

// Middleware
app.use(express.json());
app.use(
  cors({
    origin: frontendOrigin,
    credentials: true,
  })
);
app.use(cookieParser());
app.use(logger);
app.get('/api-docs.json', (req, res) => res.json(swaggerSpec));

app.use(
  '/api-docs',
  swaggerUi.serve,
  swaggerUi.setup(swaggerSpec),
);
app.use('/notes', notesRoutes);
app.use('/auth', authRoutes);

app.use((req, res, next) => {
  console.log("BACKEND REQUEST:", req.method, req.originalUrl);
  next();
});

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
