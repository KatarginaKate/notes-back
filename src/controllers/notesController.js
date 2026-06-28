import { Note } from '../models/note.js';
import createHttpError from 'http-errors';

// src/controllers/notesController.js

// Отримати список усіх нотаток
export const getAllNotes = async (req, res, next) => {
  try {
    const { page = 1, perPage = 10, tag, search } = req.query;

    const pageNum = Number(page);
    const perPageNum = Number(perPage);

    const skip = (pageNum - 1) * perPageNum;

    // 🔥 base query
    let query = Note.find({ userId: req.user._id });

    // 🔹 filter by tag
    if (tag) {
      query = query.where('tag').equals(tag);
    }

    // 🔹 search in title + content
    if (search) {
      query = query.where({
        $or: [
          { title: { $regex: search, $options: 'i' } },
          { content: { $regex: search, $options: 'i' } },
        ],
      });
    }

    // 📊 count query (IMPORTANT: separate but same chaining style)
    let countQuery = Note.find();

    if (tag) {
      countQuery = countQuery.where('tag').equals(tag);
    }

    if (search) {
      countQuery = countQuery.where({
        $or: [
          { title: { $regex: search, $options: 'i' } },
          { content: { $regex: search, $options: 'i' } },
        ],
      });
    }

    const [totalNotes, notes] = await Promise.all([
      countQuery.countDocuments(),
      query.skip(skip).limit(perPageNum).sort({ createdAt: -1 }),
    ]);

    const totalPages = Math.ceil(totalNotes / perPageNum);

    res.status(200).json({
      page: pageNum,
      perPage: perPageNum,
      totalNotes,
      totalPages,
      notes,
    });
  } catch (error) {
    next(error);
  }
};

// Отримати одну нотатку за id
export const getNoteById = async (req, res, next) => {
  const { noteId } = req.params;
  const note = await Note.findOne({ _id: noteId, userId: req.user._id });

  if (!note) {
    throw createHttpError(404, 'Note not found');
  }

  res.status(200).json(note);
};

// Створити нову нотатку

export const createNote = async (req, res) => {
  const newNote = await Note.create({
    ...req.body,
    userId: req.user._id,
  });

  res.status(201).json(newNote);
};

// Видалити нотатку за id
export const deleteNote = async (req, res) => {
  const { noteId } = req.params;
  const note = await Note.findOneAndDelete({
    _id: noteId,
    userId: req.user._id,
  });

  if (!note) {
    throw createHttpError(404, 'Note not found');
  }

  res.status(200).json(note);
};

// Оновлення нотатки за id
export const updateNote = async (req, res) => {
  const { noteId } = req.params;

  const note = await Note.findOneAndUpdate(
    { _id: noteId, userId: req.user._id }, // Шукаємо по id і userId
    req.body,
    { returnDocument: 'after' }, // повертаємо оновлений документ
  );

  if (!note) {
    throw createHttpError(404, 'Note not found');
  }

  res.status(200).json(note);
};
