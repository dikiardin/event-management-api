import { prisma } from "../config/prisma";

export class CouponRepository {
  public static async getCouponsByUserIdRepo(userId: number) {
    return prisma.coupon.findMany({
      where: { user_id: userId },
    });
  }
}
