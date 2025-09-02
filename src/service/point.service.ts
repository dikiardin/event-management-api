import { PointRepository } from "../repositories/point.repository";
import { prisma } from "../config/prisma";

export class PointService {
  public static async getPointsByUserIdService(userId: number) {
    const points = await PointRepository.getPointsByUserIdRepo(userId);
    return points;
  }

  public static async deleteExpiredPointsService() {
    const result = await prisma.point.deleteMany({
      where: {
        point_expired: {
          lt: new Date(), 
        },
      },
    });
    console.log(`[PointService] Deleted ${result.count} expired points`);
  }
}