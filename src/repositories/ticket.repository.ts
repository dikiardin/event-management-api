import { prisma } from "../config/prisma";

export class TicketRepository {
  public static async findByEventIdRepo(eventId: number) {
    return prisma.ticket.findMany({
      where: { event_id: eventId },
    });
  }
}
