import { transport } from "../config/nodemailer";
import bcrypt from "bcrypt";
import { prisma } from "../config/prisma";
import { createToken } from "../utils/createToken";
import { decodeToken } from "../middleware/verifyToken";
import {
  createAccount,
  findByEmail,
  findUserById,
  updateUser,
} from "../repositories/accounts.repository";

export const registerService = async (data: {
  email: string;
  password: string;
  username: string;
  role: "USER" | "ORGANIZER";
}) => {
  const { email, password, username, role } = data;

  // cek email duplicate
  const existingUser = await findByEmail(email);
  if (existingUser) throw { status: 400, message: "Email already registered" };

  // hash password
  const hashedPassword = await bcrypt.hash(password, 10);

  // buat user
  const user = await createAccount({
    email,
    password: hashedPassword,
    username,
    is_verified: false,
    role,
  });

  // generate referral code unik
  const referralCode = `USER${user.id}-${Math.random()
    .toString(36)
    .substring(2, 8)
    .toUpperCase()}`;

  // update user dengan referral code
  const updatedUser = await prisma.user.update({
    where: { id: user.id },
    data: { referral_code: referralCode },
  });

  // jika role organizer, buat record EventOrganizer otomatis
  if (role === "ORGANIZER") {
    await prisma.eventOrganizer.create({
      data: {
        user_id: updatedUser.id,
        event_organizer_name: `${username} Organizer`, // default nama
        event_organizer_description: "", // bisa diupdate nanti
        event_organizer_bank_account: "", // bisa diupdate nanti
      },
    });
  }

  // token verifikasi email
  const token = createToken({ id: updatedUser.id }, "1h");
  const link = `http://localhost:3000/verify/${token}`;

  await transport.sendMail({
    to: email,
    subject: "Verify your account",
    html: `<p>Hi ${username},</p>
           <p>Please verify your account:</p>
           <a href="${link}" target="_blank">Verify Account</a>
           <p>This link will expire in <strong>1 hour</strong></p>`,
  });

  return updatedUser;
};

export const loginService = async (email: string, password: string) => {
  const user = await findByEmail(email);
  if (!user) throw new Error("Invalid email or password");

  const isPasswordValid = await bcrypt.compare(password, user.password);
  if (!isPasswordValid) throw new Error("Invalid email or password");

  // tambah role ke payload token
  const token = createToken(
    { id: user.id, role: user.role }, // <- role masuk sini
    "24h"
  );

  return {
    token,
    user: {
      id: user.id,
      email: user.email,
      username: user.username,
      role: user.role,
      is_verified: user.is_verified,
    },
  };
};

export const verifyEmailService = async (token: string) => {
  const decoded: any = decodeToken(token);
  if (!decoded?.id) throw { status: 400, message: "Invalid link" };

  const user = await findUserById(decoded.id);
  if (!user) throw { status: 404, message: "User not found" };

  if (user.is_verified) {
    return { message: "User already verified", user };
  }

  const updatedUser = await updateUser(decoded.id, { is_verified: true });
  return { message: "Email verified successfully", user: updatedUser };
};

export const keepLoginService = async (userId: number) => {
  const signInUser = await findUserById(userId);
  if (!signInUser) throw { status: 404, message: "Account not found" };

  const newToken = createToken({ id: signInUser.id }, "24h");
  return {
    email: signInUser.email,
    username: signInUser.username,
    role: signInUser.role,
    token: newToken,
  };
};
