import { Router } from "express";
import VoucherController from "../controllers/voucher.controller";
import { verifyToken } from "../middleware/verifyToken";
import { verifyRole } from "../middleware/verifyRole";
import { RoleType } from "../generated/prisma";

class VoucherRouter {
  private route: Router;
  private voucherController: VoucherController;

  constructor() {
    this.route = Router();
    this.voucherController = new VoucherController();
    this.initializeRoute();
  }

  private initializeRoute(): void {
    // create voucher (hanya ORGANIZER)
    this.route.post(
      "/create/:event_id",
      verifyToken,
      verifyRole([RoleType.ORGANIZER]),
      this.voucherController.createVoucher
    );

    this.route.get("/event/:event_id", VoucherController.getVouchersByEvent);
  }

  public getRouter(): Router {
    return this.route;
  }
}

export default VoucherRouter;
