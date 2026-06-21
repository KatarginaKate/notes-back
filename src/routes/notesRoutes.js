import { Router } from 'express';

import {
	getAllNotes,
	getNoteById,
	createNote,
  deleteNote,
  updateNote
} from '../controllers/notesController.js';

const router = Router();

// src/routes/notesRoutes.js

router.get('/', getAllNotes);
router.get('/notes/:noteId', getNoteById);
router.post('/', createNote);
router.delete('/notes/:noteId', deleteNote);
router.patch('/notes/:noteId', updateNote);

export default router;
