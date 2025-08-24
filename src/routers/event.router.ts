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
    // 🟢 Create event (hanya ORGANIZER & ADMIN)
    this.route.post(
      "/",
      verifyToken,
      verifyRole([RoleType.ADMIN, RoleType.ORGANIZER]),
      this.eventController.create
    );

    // 🟢 Get all events (public)
    this.route.get("/", this.eventController.getAll);

    // 🟢 Get detail event (public)
    this.route.get("/:id", this.eventController.getById);

    // 🟢 Update event (hanya ORGANIZER & ADMIN)
    this.route.patch(
      "/:id",
      verifyToken,
      verifyRole([RoleType.ADMIN, RoleType.ORGANIZER]),
      this.eventController.update
    );

    // 🟢 Delete event (hanya ADMIN)
    this.route.delete(
      "/:id",
      verifyToken,
      verifyRole([RoleType.ADMIN, RoleType.ORGANIZER]),
      this.eventController.delete
    );
  }

  public getRouter(): Router {
    return this.route;
  }
}

export default EventRouter;
