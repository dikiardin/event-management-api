import EventRepository from "../repositories/event.repository";
import { prisma } from "../config/prisma";

export default class EventService {
  private eventRepository: EventRepository;

  constructor() {
    this.eventRepository = new EventRepository();
  }

  async createEvent(user: any, data: any) {
    if (!user) throw { status: 401, message: "Unauthorized" };
    if (user.role !== "ORGANIZER")
      throw { status: 403, message: "Only organizer can create event" };

    // Ambil event_organizer_id dari user
    const organizer = await prisma.eventOrganizer.findUnique({
      where: { user_id: user.id },
    });

    if (!organizer)
      throw { status: 403, message: "User is not registered as organizer" };

    return this.eventRepository.create({
      ...data,
      event_organizer_id: organizer.id,
      available_seats: data.total_seats ?? 0,
    });
  }

  async getEvents() {
    return this.eventRepository.findAll();
  }

  async getEventById(id: number) {
    const event = await this.eventRepository.findById(id);
    if (!event) throw { status: 404, message: "Event not found" };
    return event;
  }

  async updateEvent(id: number, data: any) {
    return this.eventRepository.update(id, data);
  }

  async deleteEvent(user: any, eventId: number) {
    const event = await this.eventRepository.findById(eventId);
    if (!event) throw { status: 404, message: "Event not found" };

    // Organizer hanya bisa menghapus event miliknya sendiri
    if (user.role === "ORGANIZER") {
      const organizer = await prisma.eventOrganizer.findUnique({
        where: { user_id: user.id },
      });

      if (!organizer || organizer.id !== event.event_organizer_id) {
        throw {
          status: 403,
          message: "You are not allowed to delete this event",
        };
      }
    }

    // Admin tetap bisa delete semua event
    return this.eventRepository.delete(eventId);
  }
}
