import { Router } from "express";
import EventController from "../controllers/event.controller";
import { verifyToken } from "../middleware/verifyToken";
import { verifyRole } from "../middleware/verifyRole";
import { RoleType } from "../generated/prisma";

class EventRouter {
  private route: Router;
  private eventController: EventController;

  constructor() {
    this.route = Router();
    this.eventController = new EventController();
    this.initializeRoute();
  }

  private initializeRoute(): void {
    // create event (hanya ORGANIZER)
    this.route.post(
      "/create",
      verifyToken,
      verifyRole([RoleType.ORGANIZER]),
      this.eventController.create
    );

    // get all events (public)
    this.route.get("/", this.eventController.getAll);

    // get detail event (public)
    this.route.get("/detail/:id", this.eventController.getById);

    // update event (hanya ORGANIZER)
    this.route.patch(
      "/edit/:id",
      verifyToken,
      verifyRole([RoleType.ORGANIZER]),
      this.eventController.update
    );

    // delete event (hanya ORGANIZER)
    this.route.delete(
      "/delete/:id",
      verifyToken,
      verifyRole([RoleType.ORGANIZER]),
      this.eventController.delete
    );
  }

  public getRouter(): Router {
    return this.route;
  }
}

export default EventRouter;
