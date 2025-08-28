import { Router } from "express";
import AuthController from "../controllers/auth.controller";
import {
  loginValidation,
  registerValidation,
} from "../middleware/validator/auth";
import { verifyToken } from "../middleware/verifyToken";

class AuthRouter {
  private route: Router;
  private authController: AuthController;

  constructor() {
    this.route = Router();
    this.authController = new AuthController();
    this.initializeRoute();
  }

  private initializeRoute(): void {
    this.route.post(
      "/signup",
      registerValidation,
      this.authController.register
    );

    this.route.post("/signin", loginValidation, this.authController.login);

    this.route.get("/keep", verifyToken, this.authController.keepLogin);

    this.route.get("/verify", this.authController.verifyEmail);
  }

  public getRouter(): Router {
    return this.route;
  }
}

export default AuthRouter;
