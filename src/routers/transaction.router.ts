import { Router } from "express";
import { TransactionController } from "../controllers/transaction.controller";
import { verifyToken } from "../middleware/verifyToken";
import { verifyRole } from "../middleware/verifyRole";
import { RoleType } from "../generated/prisma";
import multer from "multer";

const upload = multer({ storage: multer.memoryStorage() });

export class TransactionRouter {
  private route: Router;
  private transactionController: TransactionController;

  constructor() {
    this.route = Router();
    this.transactionController = new TransactionController();
    this.initializeRoute();
  }

  private initializeRoute(): void {
    this.route.post(
      "/",
      verifyToken,
      this.transactionController.createTransaction
    );
    // Routes with specific ID parameters - MUST BE BEFORE generic /:id route
    this.route.post(
      "/upload-proof/:id",
      verifyToken,
      upload.single("payment_proof"),
      this.transactionController.uploadPaymentProof
    );
    this.route.post(
      "/cancel/:id",
      verifyToken,
      this.transactionController.cancelTransaction
    );

    // New routes for organizer transaction management - MUST BE BEFORE /:id route
    // Use /organizer/transactions to avoid conflict with /:id route
    this.route.get(
      "/organizer/transactions",
      verifyToken,
      verifyRole([RoleType.ORGANIZER]),
      this.transactionController.getOrganizerTransactions
    );

    // Keep the old route for backward compatibility but redirect to new one
    this.route.get(
      "/organizer",
      verifyToken,
      verifyRole([RoleType.ORGANIZER]),
      (req, res) => {
        // Redirect to the new endpoint
        res.redirect(307, "/transaction/organizer/transactions");
      }
    );

    this.route.get(
      "/user/:userId",
      verifyToken,
      this.transactionController.getTransactionsByUserId
    );
    this.route.get(
      "/event/:eventId",
      verifyToken,
      verifyRole([RoleType.ORGANIZER]),
      this.transactionController.getTransactionsByEventId
    );

    // Alternative route for debugging and testing
    this.route.get(
      "/organizer/simple",
      verifyToken,
      verifyRole([RoleType.ORGANIZER]),
      this.transactionController.getOrganizerTransactionsSimple
    );

    // All routes with specific parameters MUST BE BEFORE generic /:id route
    this.route.get(
      "/organizer/status/:status",
      verifyToken,
      verifyRole([RoleType.ORGANIZER]),
      this.transactionController.getOrganizerTransactionsByStatus
    );

    this.route.post(
      "/organizer/accept/:id",
      verifyToken,
      verifyRole([RoleType.ORGANIZER]),
      this.transactionController.acceptTransaction
    );

    this.route.post(
      "/organizer/reject/:id",
      verifyToken,
      verifyRole([RoleType.ORGANIZER]),
      this.transactionController.rejectTransaction
    );

    this.route.get(
      "/organizer/proof/:id",
      verifyToken,
      verifyRole([RoleType.ORGANIZER]),
      this.transactionController.getTransactionPaymentProof
    );

    this.route.get(
      "/organizer/stats",
      verifyToken,
      verifyRole([RoleType.ORGANIZER]),
      this.transactionController.getOrganizerTransactionStats
    );

    this.route.get(
      "/:id",
      verifyToken,
      TransactionController.getTransactionById
    );
  }

  public getRouter(): Router {
    return this.route;
  }
}
