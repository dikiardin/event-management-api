import { Request, Response, NextFunction } from "express";
import {
  createEventService,
  getEventsService,
  getEventByIdService,
  updateEventService,
  deleteEventService,
} from "../service/event.service";

export default class EventController {
  public async create(req: Request, res: Response, next: NextFunction) {
    try {
      const user = res.locals.decrypt;

      if (!req.body.title || !req.body.date || !req.body.category) {
        return res
          .status(400)
          .json({ success: false, message: "All fields are required" });
      }

      const newEvent = await createEventService(user, req.body);

      return res.status(201).json({
        success: true,
        message: "Event created successfully",
        data: newEvent,
      });
    } catch (error: any) {
      return res.status(error.status || 500).json({
        success: false,
        message: error.message || "Internal Server Error",
      });
    }
  }

  public async getAll(req: Request, res: Response, next: NextFunction) {
    try {
      const { category } = req.query;

      const events = await getEventsService(category as string | undefined);

      return res.status(200).json({
        success: true,
        message: "Events retrieved successfully",
        data: events,
      });
    } catch (error: any) {
      return res.status(error.status || 500).json({
        success: false,
        message: error.message || "Internal Server Error",
      });
    }
  }

  public async getById(
    req: Request<{ id: string }>,
    res: Response,
    next: NextFunction
  ) {
    try {
      const id = Number(req.params.id);
      if (isNaN(id))
        return res.status(400).json({ success: false, message: "Invalid ID" });

      const event = await getEventByIdService(id);

      return res.status(200).json({
        success: true,
        message: "Event retrieved successfully",
        data: event,
      });
    } catch (error: any) {
      return res.status(error.status || 500).json({
        success: false,
        message: error.message || "Internal Server Error",
      });
    }
  }

  public async update(
    req: Request<{ id: string }>,
    res: Response,
    next: NextFunction
  ) {
    try {
      const id = Number(req.params.id);
      if (isNaN(id))
        return res.status(400).json({ success: false, message: "Invalid ID" });

      const updatedEvent = await updateEventService(id, req.body);

      return res.status(200).json({
        success: true,
        message: "Event updated successfully",
        data: updatedEvent,
      });
    } catch (error: any) {
      return res.status(error.status || 500).json({
        success: false,
        message: error.message || "Internal Server Error",
      });
    }
  }

  public async delete(
    req: Request<{ id: string }>,
    res: Response,
    next: NextFunction
  ) {
    try {
      const id = Number(req.params.id);
      if (isNaN(id))
        return res.status(400).json({ success: false, message: "Invalid ID" });

      const user = res.locals.decrypt;
      await deleteEventService(user, id);

      return res.status(200).json({
        success: true,
        message: "Event deleted successfully",
      });
    } catch (error: any) {
      return res.status(error.status || 500).json({
        success: false,
        message: error.message || "Internal Server Error",
      });
    }
  }
}
