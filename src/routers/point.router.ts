import { Router } from "express";
import { PointController } from "../controllers/point.controller";
import { verifyToken } from "../middleware/verifyToken";

class PointRouter {
  private route: Router;
  private pointController: PointController;

  constructor() {
    this.route = Router();
    this.pointController = new PointController();
    this.initializeRoute();
  }

  private initializeRoute(): void {
    // Get points by user ID
    this.route.get(
      "/user/:user_id",
      verifyToken,
      this.pointController.getPointsByUser
    );
  }

  public getRouter(): Router {
    return this.route;
  }
}

export default PointRouter;