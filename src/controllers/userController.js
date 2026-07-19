import createHttpError from "http-errors";
import { User } from "../models/user.js";
import { saveFileToCloudinary } from '../utils/saveFileToCloudinary.js';

export const getCurrentUser = async (req, res, next) => {
  try {
    const userId = req.user._id;
    const user = await User.findById(userId).select('-password'); // Exclude password
    if (!user) {
      throw createHttpError(404, 'User not found');
    }
    res.status(200).json(user);
  } catch (error) {
    next(error);
  }
};

export const updateUserProfile = async (req, res, next) => {
  try {
    const userId = req.user._id;
    const { username, email } = req.body;

    const updatedUser = await User.findByIdAndUpdate(
      userId,
      { username, email },
      { new: true, runValidators: true }
    ).select('-password'); // Exclude password

    if (!updatedUser) {
      throw createHttpError(404, 'User not found');
    }

    res.status(200).json(updatedUser);
  } catch (error) {
    next(error);
  }
};

export const updateUserAvatar = async (req, res, next) => {
  console.log(req.file);
  if (!req.file) {
    throw createHttpError(400, "No file uploaded");
  }

  const result = await saveFileToCloudinary(req.file.buffer, req.user._id);

  const updatedUser = await User.findOneAndUpdate(
    { _id: req.user._id },
    { avatar: result.secure_url },
    { returnDocument: "after" },
  );

  res.status(200).json({ url: updatedUser.avatar });
};
