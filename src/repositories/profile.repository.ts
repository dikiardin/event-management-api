import { prisma } from "../config/prisma";

// Update profil user (username, profile_pic, email)
export const updateProfileRepo = async (
  userId: number,
  data: Partial<{ username?: string; profile_pic?: string; email?: string }>
) => {
  return prisma.user.update({
    where: { id: userId },
    data,
  });
};

// Update password lama → baru
export const changePasswordRepo = async (
  userId: number,
  newHashedPassword: string
) => {
  return prisma.user.update({
    where: { id: userId },
    data: { password: newHashedPassword },
  });
};

// Reset password (langsung set baru)
export const resetPasswordRepo = async (
  userId: number,
  newHashedPassword: string
) => {
  return prisma.user.update({
    where: { id: userId },
    data: { password: newHashedPassword },
  });
};

// Cari user by id
export const findUserByIdRepo = async (userId: number) => {
  return prisma.user.findUnique({
    where: { id: userId },
  });
};

// Cari user by email
export const findByEmailRepo = async (email: string) => {
  return prisma.user.findUnique({
    where: { email },
  });
};
