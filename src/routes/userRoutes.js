import { Router } from "express";
import { authenticate } from "../middleware/authenticate.js";
import {
  getCurrentUser,
  updateUserProfile,
  updateUserAvatar,
} from "../controllers/userController.js";
import { upload } from "../middleware/multer.js";

const router = Router();

// GET /users/me
router.get("/me", authenticate, getCurrentUser);

// PATCH /users/me
router.patch("/me", authenticate, updateUserProfile);

// PATCH /users/me/avatar
router.patch(
  "/me/avatar",
  authenticate,
  upload.single("avatar"),
  updateUserAvatar
);

export default router;
