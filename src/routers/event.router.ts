import { Router } from "express";
import EventController from "../controllers/event.controller";
import { verifyToken } from "../middleware/verifyToken";
import { verifyRole } from "../middleware/verifyRole";
import { RoleType } from "../generated/prisma";
import multer from "multer";

const upload = multer({ storage: multer.memoryStorage() });

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
      upload.single("event_thumbnail"),
      this.eventController.createEvent
    );

    // get all events (public)
    this.route.get("/", this.eventController.getAllEvent);

    // test endpoint tanpa middleware
    this.route.get("/test", (req, res) => {
      res.json({
        message: "Test endpoint works!",
        timestamp: new Date().toISOString(),
      });
    });

    // get events by organizer (dashboard) - HARUS DI ATAS /detail/:title
    this.route.get(
      "/organizer",
      verifyToken,
      verifyRole([RoleType.ORGANIZER]),
      this.eventController.getEventsByOrganizer
    );

    // get event statistics for organizer
    this.route.get(
      "/organizer/stats",
      verifyToken,
      verifyRole([RoleType.ORGANIZER]),
      this.eventController.getOrganizerStats
    );

    // get transactions by organizer
    this.route.get(
      "/organizer/transactions",
      verifyToken,
      verifyRole([RoleType.ORGANIZER]),
      this.eventController.getOrganizerTransactions
    );

    // get detail event (public) - HARUS DI BAWAH /organizer
    this.route.get("/detail/:event_name", this.eventController.getEventByName);

    // update event (hanya ORGANIZER)
    this.route.patch(
      "/edit/:id",
      verifyToken,
      verifyRole([RoleType.ORGANIZER]),
      this.eventController.updateEvent
    );

    // delete event (hanya ORGANIZER)
    this.route.delete(
      "/delete/:id",
      verifyToken,
      verifyRole([RoleType.ORGANIZER]),
      this.eventController.deleteEvent
    );
  }

  public getRouter(): Router {
    return this.route;
  }
}

export default EventRouter;
