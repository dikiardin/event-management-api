import { TicketRepository } from "../repositories/ticket.repository";

export class TicketService {
  public static async getTicketsByEventIdService(eventId: number) {
    const tickets = await TicketRepository.findByEventIdRepo(eventId);
    if (!tickets || tickets.length === 0) {
      throw new Error("No tickets found for this event");
    }
    return tickets;
  }
}