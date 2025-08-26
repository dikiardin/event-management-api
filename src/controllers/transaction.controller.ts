import { Request, Response, NextFunction } from "express";
import { TransactionService } from "../service/transaction.service";
import multer from "multer";

const upload = multer({ storage: multer.memoryStorage() });

export class TransactionController {
  // Create transaction
  public async createTransaction(req: Request, res: Response, next: NextFunction) {
    try {
      const userId = res.locals.decrypt?.id;
      if (!userId) throw new Error("Unauthorized");

      const { tickets, pointsUsed, couponId, voucherId } = req.body;

      const transaction = await TransactionService.createTransaction(
        userId,
        tickets,
        pointsUsed,
        couponId,
        voucherId
      );
      res.json(transaction);
    } catch (error) {
      next(error);
    }
  }

  // Upload payment proof
  public uploadPaymentProof = [
    upload.single("payment_proof"), // field name from frontend form
    async (req: Request, res: Response, next: NextFunction) => {
      try {
        const userId = res.locals.decrypt?.id;
        if (!userId) throw new Error("Unauthorized");

        const { id } = req.params;
        if (!req.file) throw new Error("No payment proof file uploaded");

        // Check ownership
        const transaction = await TransactionService.uploadPaymentProof(Number(id), req.file);
        if (transaction.user_id !== userId) throw new Error("Unauthorized: cannot modify other user's transaction");

        res.json(transaction);
      } catch (error) {
        next(error);
      }
    },
  ];

  // Cancel transaction
  public async cancelTransaction(req: Request, res: Response, next: NextFunction) {
    try {
      const userId = res.locals.decrypt?.id;
      if (!userId) throw new Error("Unauthorized");

      const { id } = req.params;

      // Check ownership inside service
      const transaction = await TransactionService.cancelTransaction(Number(id));
      if (transaction.user_id !== userId) throw new Error("Unauthorized: cannot cancel other user's transaction");

      res.json(transaction);
    } catch (error) {
      next(error);
    }
  }
}