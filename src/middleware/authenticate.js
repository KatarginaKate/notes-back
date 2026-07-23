import createHttpError from 'http-errors';
import { Session } from '../models/session.js';
import { User } from '../models/user.js';

export const authenticate = async (req, res, next) => {
  const { sessionId } = req.cookies;

  // 1. Перевіряємо наявність sessionId
  if (!sessionId) {
    throw createHttpError(401, 'Missing session');
  }

  // 2. Шукаємо сесію
  const session = await Session.findById(sessionId);

  if (!session) {
    throw createHttpError(401, 'Session not found');
  }

  // 3. Перевіряємо термін дії access токена
  const isAccessTokenExpired = session.accessTokenValidUntil < new Date();

  if (isAccessTokenExpired) {
    throw createHttpError(401, 'Access token expired');
  }

  // 4. Шукаємо користувача
  const user = await User.findById(session.userId);

  if (!user) {
    throw createHttpError(401, 'User not found');
  }

  // 5. Додаємо користувача до req
  req.user = user;

  next();
};
