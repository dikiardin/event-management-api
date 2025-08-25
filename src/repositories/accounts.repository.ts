import { prisma } from "../config/prisma";

export const createAccount = async (data: {
  email: string;
  password: string;
  username: string;
  is_verified: boolean;
  role: "USER" | "ORGANIZER";
}) => {
  return prisma.user.create({ data });
};

export const findByEmail = async (email: string) => {
  return await prisma.user.findUnique({
    where: { email },
  });
};

export const findUserById = async (id: number) => {
  return await prisma.user.findUnique({
    where: { id },
  });
};

export const updateUser = async (
  id: number,
  data: Partial<{ is_verified: boolean }>
) => {
  return prisma.user.update({
    where: { id },
    data,
  });
};
