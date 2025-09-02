import { Router } from "express";
import { TicketController } from "../controllers/ticket.controller";
import { verifyToken } from "../middleware/verifyToken";        

class TicketRouter {
  private route: Router;
  private ticketController: TicketController;

  constructor() {
    this.route = Router();
    this.ticketController = new TicketController();
    this.initializeRoute();
  }

  private initializeRoute(): void {
    this.route.get(
      "/event/:event_id",
      verifyToken,
      this.ticketController.getTicketsByEventId
    );
  }

  public getRouter(): Router {
    return this.route;
  }
}

export default TicketRouter;