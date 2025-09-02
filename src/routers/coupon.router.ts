// routes/coupon.route.ts
import { Router } from "express";
import { CouponController } from "../controllers/coupon.controller";
import { verifyToken } from "../middleware/verifyToken";

class CouponRouter {
  private route: Router;
  private couponController: CouponController;

  constructor() {
    this.route = Router();
    this.couponController = new CouponController();
    this.initializeRoute();
  }

  private initializeRoute(): void {
    // Get coupons by user ID
    this.route.get(
      "/user/:user_id",
      verifyToken,
      this.couponController.getCouponsByUser
    );
  }

  public getRouter(): Router {
    return this.route;
  }
}

export default CouponRouter;