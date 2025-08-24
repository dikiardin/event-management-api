import { Request, Response, NextFunction } from "express";
import EventService from "../service/event.service";

export default class EventController {
  private eventService: EventService;

  constructor() {
    this.eventService = new EventService();
  }

  create = async (req: Request, res: Response, next: NextFunction) => {
    try {
      const user = res.locals.decrypt;
      const newEvent = await this.eventService.createEvent(user, req.body);
      res.status(201).json({ success: true, data: newEvent });
    } catch (error) {
      next(error);
    }
  };

  getAll = async (req: Request, res: Response, next: NextFunction) => {
    try {
      const events = await this.eventService.getEvents();
      res.status(200).json({ success: true, data: events });
    } catch (error) {
      next(error);
    }
  };

  getById = async (
    req: Request<{ id: string }>,
    res: Response,
    next: NextFunction
  ) => {
    try {
      const id = Number(req.params.id);
      if (isNaN(id))
        return res.status(400).json({ success: false, message: "Invalid ID" });

      const event = await this.eventService.getEventById(id);
      res.status(200).json({ success: true, data: event });
    } catch (error) {
      next(error);
    }
  };

  update = async (
    req: Request<{ id: string }>,
    res: Response,
    next: NextFunction
  ) => {
    try {
      const id = Number(req.params.id);
      if (isNaN(id))
        return res.status(400).json({ success: false, message: "Invalid ID" });

      const updatedEvent = await this.eventService.updateEvent(id, req.body);
      res.status(200).json({ success: true, data: updatedEvent });
    } catch (error) {
      next(error);
    }
  };

  delete = async (
    req: Request<{ id: string }>,
    res: Response,
    next: NextFunction
  ) => {
    try {
      const id = Number(req.params.id);
      if (isNaN(id))
        return res.status(400).json({ success: false, message: "Invalid ID" });

      const user = res.locals.decrypt; // ambil data user dari JWT
      await this.eventService.deleteEvent(user, id);

      res.status(200).json({ success: true, message: "Event deleted" });
    } catch (error) {
      next(error);
    }
  };
}
