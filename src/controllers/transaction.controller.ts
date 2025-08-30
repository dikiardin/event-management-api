import { Request, Response, NextFunction } from "express";
import { TransactionService } from "../service/transaction.service";

export class TransactionController {
  public async createTransaction(
    req: Request,
    res: Response,
    next: NextFunction
  ) {
    try {
      const userId = res.locals.decrypt?.id;
      if (!userId) throw new Error("Unauthorized");

      const { tickets, pointId, couponId, voucherId } = req.body;
      const transaction = await TransactionService.createTransactionService(
        userId,
        tickets,
        couponId,
        voucherId,
        pointId
      );
      res
        .status(201)
        .json({
          success: true,
          message: "Transaction created succesfully",
          transaction,
        });
    } catch (error) {
      next(error);
    }
  }

  public async uploadPaymentProof(
    req: Request,
    res: Response,
    next: NextFunction
  ) {
    try {
      const userId = res.locals.decrypt?.id;
      if (!userId) throw new Error("Unauthorized");
      if (!req.file) throw new Error("No payment proof file uploaded");

      const { id } = req.params;
      const transaction = await TransactionService.uploadPaymentProofService(
        Number(id),
        req.file
      );
      if (transaction.user_id !== userId)
        throw new Error("Unauthorized upload");

      res.status(200).json({
        success: true,
        message: "Payment proof uploaded",
        transaction,
      });
    } catch (error) {
      next(error);
    }
  }

  public async cancelTransaction(
    req: Request,
    res: Response,
    next: NextFunction
  ) {
    try {
      const userId = res.locals.decrypt?.id;
      if (!userId) throw new Error("Unauthorized");

      const { id } = req.params;
      const transaction = await TransactionService.cancelTransactionService(
        Number(id),
        userId
      );
      res
        .status(200)
        .json({ success: true, message: "Transaction cancelled", transaction });
    } catch (error) {
      next(error);
    }
  }

  public async getTransactionsByUserId(
    req: Request,
    res: Response,
    next: NextFunction
  ) {
    try {
      const { userId } = req.params;
      const transactions =
        await TransactionService.getTransactionsByUserIdService(Number(userId));
      res.status(200).json({ success: true, transactions });
    } catch (error) {
      next(error);
    }
  }

  public async getTransactionsByEventId(
    req: Request,
    res: Response,
    next: NextFunction
  ) {
    try {
      const { eventId } = req.params;
      const transactions =
        await TransactionService.getTransactionsByEventIdService(
          Number(eventId)
        );
      res.status(200).json({ success: true, transactions });
    } catch (error) {
      next(error);
    }
  }
}
