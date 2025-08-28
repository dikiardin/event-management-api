import { Router } from "express";
import { TransactionController } from "../controllers/transaction.controller"; 
import { verifyToken } from "../middleware/verifyToken";
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
    this.route.post("/", verifyToken, this.transactionController.createTransaction);
    this.route.post("/upload-proof/:id", verifyToken, upload.single("payment_proof"), this.transactionController.uploadPaymentProof);
    this.route.post("/cancel/:id", verifyToken, this.transactionController.cancelTransaction);
  }

  public getRouter(): Router {
    return this.route;
  }
}
