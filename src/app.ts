import dotenv from "dotenv";
dotenv.config();
import cors from "cors";
import express, { Application, NextFunction, Request, Response } from "express";
import AuthRouter from "./routers/auth.router";
import EventRouter from "./routers/event.router";

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
    this.app.use(cors({
      origin: process.env.FE_URL,
      methods: ["GET", "POST", "PUT", "PATCH", "DELETE"],
    }));
    this.app.use(express.json());
  }
  private route(): void {
    this.app.get("/", (req: Request, res: Response) => {
      res.status(200).send("<h1>Classbase API</h1>");
    });

    // define route
    const authRouter: AuthRouter = new AuthRouter();
    const eventRouter: EventRouter = new EventRouter();
    this.app.use("/auth", authRouter.getRouter());
    this.app.use("/event", eventRouter.getRouter());
  }

  private errorHandling(): void {
    this.app.use(
      (error: any, req: Request, res: Response, next: NextFunction) => {
        console.log(error);
        res.status(error.code || 500).send(error);
      }
    );
  }

  public start(): void {
    this.app.listen(PORT, () => {
      console.log(`API Running: http://localhost:${PORT}`);
    });
  }
}

export default App;
