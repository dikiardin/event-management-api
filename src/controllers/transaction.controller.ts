import { Request, Response, NextFunction } from "express";
import { TransactionService } from "../service/transaction.service";

export class TransactionController {
  // create transaction
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

  // upload payment proof
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
        req.file,
        userId
      );

      res.status(200).json({
        success: true,
        message: "Payment proof uploaded",
        transaction,
      });
    } catch (error) {
      next(error);
    }
  }

  // cancel transaction
  public async cancelTransaction(
    req: Request,
    res: Response,
    next: NextFunction
  ) {
    try {
      const userId = res.locals.decrypt?.id;
      if (!userId) throw new Error("Unauthorized");

      const { id } = req.params;

      // check ownership inside service
      const transaction = await TransactionService.cancelTransactionService(
        Number(id),
        userId
      );
      res.status(200).json({
        success: true,
        message: "Transaction cancelled",
        transaction,
      });
    } catch (error) {
      next(error);
    }
  }

  // get transaction by id
    public static async getTransactionById(req: Request, res: Response, next: NextFunction) {
    try {
      const id = Number(req.params.id);
      if (isNaN(id)) throw { status: 400, message: "Invalid transaction ID" };

      const transaction = await TransactionService.getTransactionByIdService(id);
      res.status(200).json(transaction);
    } catch (error) {
      next(error);
    }
  }

  // get transactions by user id
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

  // get transactions by event id
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

  // New methods for organizer transaction management
  public async getOrganizerTransactions(
    req: Request,
    res: Response,
    next: NextFunction
  ) {
    try {
      const userId = res.locals.decrypt?.id;
      if (!userId) throw new Error("Unauthorized");

      const transactions =
        await TransactionService.getOrganizerTransactionsService(userId);
      res.status(200).json({ success: true, transactions });
    } catch (error) {
      next(error);
    }
  }

  // Alternative method for debugging and testing
  public async getOrganizerTransactionsSimple(
    req: Request,
    res: Response,
    next: NextFunction
  ) {
    try {
      const userId = res.locals.decrypt?.id;
      if (!userId) throw new Error("Unauthorized");

      const transactions =
        await TransactionService.getOrganizerTransactionsSimpleService(userId);
      res.status(200).json({ success: true, transactions });
    } catch (error) {
      next(error);
    }
  }

  public async getOrganizerTransactionsByStatus(
    req: Request,
    res: Response,
    next: NextFunction
  ) {
    try {
      const userId = res.locals.decrypt?.id;
      if (!userId) throw new Error("Unauthorized");

      const { status } = req.params;
      if (!status) throw new Error("Status parameter is required");

      const transactions =
        await TransactionService.getOrganizerTransactionsByStatusService(
          userId,
          status
        );
      res.status(200).json({ success: true, transactions });
    } catch (error) {
      next(error);
    }
  }

  public async acceptTransaction(
    req: Request,
    res: Response,
    next: NextFunction
  ) {
    try {
      const userId = res.locals.decrypt?.id;
      if (!userId) throw new Error("Unauthorized");

      const { id } = req.params;
      const transaction = await TransactionService.acceptTransactionService(
        Number(id),
        userId
      );

      res.status(200).json({
        success: true,
        message: "Transaction accepted successfully",
        transaction,
      });
    } catch (error) {
      next(error);
    }
  }

  public async rejectTransaction(
    req: Request,
    res: Response,
    next: NextFunction
  ) {
    try {
      const userId = res.locals.decrypt?.id;
      if (!userId) throw new Error("Unauthorized");

      const { id } = req.params;
      const { rejection_reason } = req.body;

      const transaction = await TransactionService.rejectTransactionService(
        Number(id),
        userId,
        rejection_reason
      );

      res.status(200).json({
        success: true,
        message: "Transaction rejected successfully",
        transaction,
      });
    } catch (error) {
      next(error);
    }
  }

  public async getTransactionPaymentProof(
    req: Request,
    res: Response,
    next: NextFunction
  ) {
    try {
      const userId = res.locals.decrypt?.id;
      if (!userId) throw new Error("Unauthorized");

      const { id } = req.params;
      const transaction =
        await TransactionService.getTransactionPaymentProofService(
          Number(id),
          userId
        );

      res.status(200).json({
        success: true,
        transaction,
      });
    } catch (error) {
      next(error);
    }
  }

  public async getOrganizerTransactionStats(
    req: Request,
    res: Response,
    next: NextFunction
  ) {
    try {
      const userId = res.locals.decrypt?.id;
      if (!userId) throw new Error("Unauthorized");

      const stats =
        await TransactionService.getOrganizerTransactionStatsService(userId);

      res.status(200).json({
        success: true,
        stats,
      });
    } catch (error) {
      next(error);
    }
  }
}
