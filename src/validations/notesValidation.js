import { Joi, Segments } from 'celebrate';
import mongoose from 'mongoose';
import { TAGS } from '../constants/tags.js';

const objectIdValidator = (value, helpers) => {
  if (!mongoose.Types.ObjectId.isValid(value)) {
    return helpers.message('Invalid note id');
  }
  return value;
};

/**
 * GET /notes
 */
export const getAllNotesSchema = {
  [Segments.QUERY]: Joi.object().keys({
    page: Joi.number().integer().min(1).default(1),

    perPage: Joi.number().integer().min(5).max(20).default(10),

    tag: Joi.string().valid(...TAGS).optional(),

    search: Joi.string().allow('').optional(),
  }),
};

/**
 * GET /notes/:noteId
 */
export const noteIdSchema = {
  [Segments.PARAMS]: Joi.object().keys({
    noteId: Joi.string().custom(objectIdValidator).required(),
  }),
};

/**
 * POST /notes
 */
export const createNoteSchema = {
  [Segments.BODY]: Joi.object().keys({
    title: Joi.string().min(1).required(),

    content: Joi.string().allow('').optional(),

    tag: Joi.string().valid(...TAGS).optional(),
  }),
};

/**
 * PATCH /notes/:noteId
 */
export const updateNoteSchema = {
  [Segments.PARAMS]: Joi.object().keys({
    noteId: Joi.string().custom(objectIdValidator).required(),
  }),

  [Segments.BODY]: Joi.object()
    .keys({
      title: Joi.string().min(1),
      content: Joi.string().allow(''),
      tag: Joi.string().valid(...TAGS),
    })
    .min(1), // хоча б одне поле
};

// src/validations/notesValidation.js

export const getNotesSchema = {
  [Segments.QUERY]: Joi.object({
    page: Joi.number().integer().min(1).default(1),
    perPage: Joi.number().integer().min(5).max(20).default(10),
  }),
};

