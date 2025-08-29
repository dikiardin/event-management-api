import { Request, Response, NextFunction } from "express";
import { TransactionService } from "../service/transaction.service";

export class TransactionController {
  // Create transaction
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
      res.status(201).json({
        success: true,
        message: "Transaction created succesfully",
        transaction,
      });
    } catch (error) {
      next(error);
    }
  }

  // Upload payment proof
  public async uploadPaymentProof(
    req: Request,
    res: Response,
    next: NextFunction
  ) {
    try {
      const userId = res.locals.decrypt?.id;
      if (!userId) throw new Error("Unauthorized");

      const { id } = req.params;
      if (!req.file) throw new Error("No payment proof file uploaded");

      // call service
      const transaction = await TransactionService.uploadPaymentProofService(
        Number(id),
        req.file
      );

      if (transaction.user_id !== userId) {
        throw new Error("Unauthorized: cannot modify other user's transaction");
      }

      res.status(200).json({
        success: true,
        message: "Payment proof uploaded successfully",
        transaction,
      });
    } catch (error) {
      next(error);
    }
  }

  // Cancel transaction
  public async cancelTransaction(
    req: Request,
    res: Response,
    next: NextFunction
  ) {
    try {
      const userId = res.locals.decrypt?.id;
      if (!userId) throw new Error("Unauthorized");

      const { id } = req.params;

      // Check ownership inside service
      const transaction = await TransactionService.cancelTransactionService(
        Number(id)
      );
      if (transaction.user_id !== userId)
        throw new Error("Unauthorized: cannot cancel other user's transaction");

      res
        .status(200)
        .json({ success: true, message: "Transaction calcelled", transaction });
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
      return res.status(200).json({
        success: true,
        message: "transaction by user id catched succesfully",
        transactions,
      });
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
      return res.status(200).json({
        success: true,
        message: "transaction by event id catched succesfully",
        transactions,
      });
    } catch (error) {
      next(error);
    }
  }
}
