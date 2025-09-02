import { Request, Response, NextFunction } from "express";
import { VoucherService } from "../service/voucher.service";

export default class VoucherController {
  public async createVoucher(req: Request, res: Response, next: NextFunction) {
    try {
      const user = res.locals.decrypt;
      const event_id = Number(req.params.event_id);  // make the voucher linked automatically to the event
      const newVoucher = await VoucherService.createVoucherService(user, event_id, req.body);

      return res.status(201).json({
        success: true,
        message: "Voucher created successfully",
        data: newVoucher,
      });
    } catch (error: any) {
      next(error);
    }
  }

  public static async getVouchersByEvent(req: Request, res: Response, next:NextFunction) {
    try {
      const eventId = Number(req.params.event_id);
      const vouchers = await VoucherService.getVouchersByEventId(eventId);
      res.status(200).json(vouchers);
    } catch (error) {
      next(error)
    }
  }
}