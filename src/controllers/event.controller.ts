import { Request, Response, NextFunction } from "express";
import {
  createEventService,
  getEventsService,
  getEventByTitleService,
  updateEventService,
  deleteEventService,
} from "../service/event.service";
import { cloudinaryUpload } from "../config/cloudinary";

export default class EventController {
  public async createEvent(req: Request, res: Response, next: NextFunction) {
    try {
      const user = res.locals.decrypt;
      let body = req.body;

      // convert stringified JSON back into an array/object
      if (body.tickets && typeof body.tickets === "string") {
        body.tickets = JSON.parse(body.tickets);
      }

      // upload thumbnail to cloudinary
      if (req.file) {
        const result = await cloudinaryUpload(req.file);
        body.event_thumbnail = result.secure_url;
      }
      const newEvent = await createEventService(user, body);

      return res.status(201).json({
        success: true,
        message: "Event created successfully",
        data: newEvent,
      });
    } catch (error: any) {
      next(error);
    }
  }

  public async getAllEvent(req: Request, res: Response, next: NextFunction) {
    try {
      const { category } = req.query;

      const events = await getEventsService(category as string | undefined);

      return res.status(200).json({
        success: true,
        message: "Events retrieved successfully",
        data: events,
      });
    } catch (error: any) {
      next(error);
    }
  }

  public async getEventByTitle(
    req: Request<{ title: string }>,
    res: Response,
    next: NextFunction
  ) {
    try {
      const { title } = req.params;

      if (!title || typeof title !== "string") {
        return res
          .status(400)
          .json({ success: false, message: "Invalid title" });
      }

      const event = await getEventByTitleService(title);

      return res.status(200).json({
        success: true,
        message: "Event retrieved successfully",
        data: event,
      });
    } catch (error: any) {
      next(error);
    }
  }

  public async updateEvent(
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
      next(error);
    }
  }

  public async deleteEvent(
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
      next(error);
    }
  }
}
