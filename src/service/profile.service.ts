import {
  updateProfileRepo,
  changePasswordRepo,
  resetPasswordRepo,
  findUserByIdRepo,
} from "../repositories/profile.repository";
import { cloudinaryUpload } from "../config/cloudinary";
import bcrypt from "bcrypt";

// Update profil (username, dsb)
export const updateProfileService = async (
  userId: number,
  data: Partial<{ username: string; profile_pic?: string }>
) => {
  const user = await findUserByIdRepo(userId);
  if (!user) throw { status: 404, message: "User not found" };

  return updateProfileRepo(userId, data);
};

// Upload pertama kali profile picture
export const uploadProfileImgService = async (
  userId: number,
  file: Express.Multer.File
) => {
  if (!file) throw { status: 400, message: "No file provided" };

  const upload = await cloudinaryUpload(file);
  return updateProfileRepo(userId, { profile_pic: upload.secure_url });
};

// Change password dengan oldPassword
export const changePasswordService = async (
  userId: number,
  oldPassword: string,
  newPassword: string
) => {
  const user = await findUserByIdRepo(userId);
  if (!user) throw { status: 404, message: "User not found" };

  const isValid = await bcrypt.compare(oldPassword, user.password);
  if (!isValid) throw { status: 400, message: "Old password is incorrect" };

  const hashed = await bcrypt.hash(newPassword, 10);
  await changePasswordRepo(userId, hashed);

  return { message: "Password changed successfully" };
};

// Reset password tanpa old password
export const resetPasswordService = async (
  userId: number,
  newPassword: string
) => {
  const user = await findUserByIdRepo(userId);
  if (!user) throw { status: 404, message: "User not found" };

  const hashed = await bcrypt.hash(newPassword, 10);
  await resetPasswordRepo(userId, hashed);

  return { message: "Password reset successfully" };
};
