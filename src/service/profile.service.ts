import {
  updateProfileRepo,
  changePasswordRepo,
  resetPasswordRepo,
  findUserByIdRepo,
  findByEmailRepo,
} from "../repositories/profile.repository";
import { cloudinaryUpload } from "../config/cloudinary";
import bcrypt from "bcrypt";
import { transport } from "../config/nodemailer";
import { createToken } from "../utils/createToken";
import { decodeToken } from "../middleware/verifyToken";

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

// Change email dengan verifikasi
export const changeEmailService = async (userId: number, newEmail: string) => {
  const user = await findUserByIdRepo(userId);
  if (!user) throw { status: 404, message: "User not found" };

  // Cek apakah email sudah digunakan
  const existingUser = await findByEmailRepo(newEmail);
  if (existingUser && existingUser.id !== userId) {
    throw { status: 400, message: "Email already in use" };
  }

  // Generate token untuk verifikasi email baru
  const token = createToken(
    {
      id: userId,
      newEmail: newEmail,
      action: "change-email",
    },
    "1h"
  );

  console.log("Generated token for email change:", token);

  const link = `http://localhost:3000/verify-email-change/${token}`;

  // Kirim email verifikasi ke email baru
  await transport.sendMail({
    to: newEmail,
    subject: "Verify your new email address",
    html: `<p>Hi ${user.username},</p>
           <p>You requested to change your email address to: <strong>${newEmail}</strong></p>
           <p>Please click the link below to verify this change:</p>
           <a href="${link}" target="_blank">Verify Email Change</a>
           <p>This link will expire in <strong>1 hour</strong></p>
           <p>If you didn't request this change, please ignore this email.</p>`,
  });

  return {
    message: "Verification email sent to new email address",
    newEmail: newEmail,
  };
};

// Verify email change
export const verifyEmailChangeService = async (token: string) => {
  try {
    console.log("Verifying email change with token:", token);

    const decoded: any = decodeToken(token);
    console.log("Decoded token:", decoded);

    if (
      !decoded?.id ||
      !decoded?.newEmail ||
      decoded?.action !== "change-email"
    ) {
      console.log("Token validation failed:", {
        id: decoded?.id,
        newEmail: decoded?.newEmail,
        action: decoded?.action,
      });
      throw { status: 400, message: "Invalid or expired token" };
    }

    console.log("Token validation passed");

    const user = await findUserByIdRepo(decoded.id);
    if (!user) throw { status: 404, message: "User not found" };

    console.log("User found:", user.id);

    // Update email
    await updateProfileRepo(decoded.id, { email: decoded.newEmail });

    console.log("Email updated successfully");

    return {
      message: "Email changed successfully",
      newEmail: decoded.newEmail,
    };
  } catch (error: any) {
    console.error("Error in verifyEmailChangeService:", error);

    if (
      error.name === "JsonWebTokenError" ||
      error.name === "TokenExpiredError"
    ) {
      throw { status: 400, message: "Invalid or expired token" };
    }
    throw error;
  }
};
