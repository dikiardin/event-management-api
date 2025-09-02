import { CouponRepository } from "../repositories/coupon.repository"; 

export class CouponService {
  public static async getCouponsByUserIdService(userId: number) {
    const coupons = await CouponRepository.getCouponsByUserIdRepo(userId);
    return coupons;
  }
}