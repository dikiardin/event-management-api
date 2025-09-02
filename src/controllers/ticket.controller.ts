import { NextFunction, Request, Response } from "express";
import { TicketService } from "../service/ticket.service";

export class TicketController {
  public async getTicketsByEventId(
    req: Request,
    res: Response,
    next: NextFunction
  ) {
    try {
      const eventId = Number(req.params.event_id);
      if (isNaN(eventId)) {
        return res.status(400).json({ message: "Invalid event_id" });
      }

      const tickets = await TicketService.getTicketsByEventIdService(eventId);

      return res.status(200).json({ tickets });
    } catch (error) {
      next(error);
    }
  }
}
