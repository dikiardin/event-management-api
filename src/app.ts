import dotenv from "dotenv";
dotenv.config();
import cors from "cors";
import express, { Application, NextFunction, Request, Response } from "express";
import AuthRouter from "./routers/auth.router";
import EventRouter from "./routers/event.router";
import VoucherRouter from "./routers/voucher.router";
import ProfileRouter from "./routers/profile.router";
import { TransactionRouter } from "./routers/transaction.router";
import { startTransactionJob } from "./job/transactionJob";

const PORT: string = process.env.PORT || "8181";

class App {
  public app: Application;

  constructor() {
    this.app = express();
    this.configure();
    this.route();
    this.errorHandling();
  }

  private configure(): void {
    this.app.use(
      cors({
        origin: ["http://localhost:3000", "http://127.0.0.1:3000"],
        methods: ["GET", "POST", "PUT", "PATCH", "DELETE", "OPTIONS"],
        credentials: false,
        allowedHeaders: ["Content-Type", "Authorization", "Accept"],
        exposedHeaders: ["Content-Type", "Authorization"],
        optionsSuccessStatus: 200,
      })
    );
    this.app.use(express.json());
  }
  private route(): void {
    this.app.get("/", (req: Request, res: Response) => {
      res.status(200).send("<h1>Classbase API</h1>");
    });

    // define route
    const authRouter: AuthRouter = new AuthRouter();
    const eventRouter: EventRouter = new EventRouter();
    const voucherRouter: VoucherRouter = new VoucherRouter();
    const profileRouter: ProfileRouter = new ProfileRouter();
    const transactionRouter: TransactionRouter = new TransactionRouter();
    this.app.use("/auth", authRouter.getRouter());
    this.app.use("/event", eventRouter.getRouter());
    this.app.use("/voucher", voucherRouter.getRouter());
    this.app.use("/profile", profileRouter.getRouter());
    this.app.use("/transaction", transactionRouter.getRouter());
  }

  private errorHandling(): void {
    this.app.use(
      (error: any, req: Request, res: Response, next: NextFunction) => {
        console.log("Global error handler:", error);

        // Handle JWT errors
        if (error.name === "JsonWebTokenError") {
          return res.status(401).json({
            success: false,
            message: "Invalid token format",
          });
        }

        if (error.name === "TokenExpiredError") {
          return res.status(401).json({
            success: false,
            message: "Token has expired",
          });
        }

        // Handle different types of errors
        if (error.status) {
          return res.status(error.status).json({
            success: false,
            message: error.message || "An error occurred",
          });
        }

        if (error.code) {
          return res.status(error.code).json({
            success: false,
            message: error.message || "An error occurred",
          });
        }

        // Default error response
        res.status(500).json({
          success: false,
          message: "Internal server error",
        });
      }
    );
  }

  public start(): void {
    this.app.listen(PORT, () => {
      console.log(`API Running: http://localhost:${PORT}`);
      startTransactionJob();
    });
  }
}

export default App;
