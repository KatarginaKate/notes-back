// src/routes/authRoutes.js

import { Router } from 'express';
import { celebrate } from 'celebrate';
import {
  loginUser,
  logoutUser,
  refreshUserSession,
  registerUser,
} from '../controllers/authController.js';
import {
  loginUserSchema,
  registerUserSchema,
} from '../validations/authValidation.js';

const router = Router();

router.post('/register', celebrate(registerUserSchema), registerUser);
router.post('/login', celebrate(loginUserSchema), loginUser);
router.post('/logout', logoutUser);
router.post('/refresh', refreshUserSession);

export default router;
