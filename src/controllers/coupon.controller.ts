import { NextFunction, Request, Response } from "express";
import { CouponService } from "../service/coupon.service";

export class CouponController {
  public async getCouponsByUser(req: Request, res: Response, next:NextFunction) {
    try {
      const userId = Number(req.params.user_id);
      const coupons = await CouponService.getCouponsByUserIdService(userId);
      res.status(200).json(coupons);
    } catch (error) {
      next(error)
    }
  }
}