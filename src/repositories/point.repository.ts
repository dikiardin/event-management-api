import { prisma } from "../config/prisma";

export class PointRepository {
  public static async getPointsByUserIdRepo(userId: number) {
    return prisma.point.findMany({
      where: { user_id: userId },
    });
  }
}