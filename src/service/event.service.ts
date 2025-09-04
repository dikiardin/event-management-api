import {
  createEventRepo,
  findAllEventsRepo,
  findEventByIdRepo,
  updateEventRepo,
  deleteEventRepo,
  findEventsByOrganizerRepo,
  getOrganizerStatsRepo,
  getOrganizerTransactionsRepo,
  findEventByNameRepo,
} from "../repositories/event.repository";
import { prisma } from "../config/prisma";

export const createEventService = async (user: any, data: any) => {
  if (!user) throw { status: 401, message: "Unauthorized" };

  if (user.role !== "ORGANIZER") {
    throw { status: 403, message: "Only organizer can create events" };
  }

  if (!data.event_name || !data.event_start_date || !data.event_end_date) {
    throw { status: 400, message: "Missing required event fields" };
  }

  if (!Array.isArray(data.tickets) || data.tickets.length === 0) {
    throw { status: 400, message: "Event must have at least one ticket type" };
  }

    const existingEvent = await findEventByNameRepo(data.event_name);
  if (existingEvent) {
    throw { status: 409, message: "Event name has already been registered" };
  }

  return createEventRepo(user.id, data);
};

export const getEventsService = async (category?: string) => {
  return findAllEventsRepo(category);
};

export const getEventByNameService = async (event_name: string) => {
  const event = await findEventByNameRepo(event_name);
  if (!event) throw { status: 404, message: "Event not found" };
  return event;
};

export const getEventsByOrganizerService = async (userId: number) => {
  return findEventsByOrganizerRepo(userId);
};

export const getOrganizerStatsService = async (userId: number) => {
  return getOrganizerStatsRepo(userId);
};

export const getOrganizerTransactionsService = async (userId: number) => {
  return getOrganizerTransactionsRepo(userId);
};

export const updateEventService = async (id: number, data: any) => {
  return updateEventRepo(id, data);
};

export const deleteEventService = async (user: any, eventId: number) => {
  const event = await findEventByIdRepo(eventId);
  if (!event) throw { status: 404, message: "Event not found" };

  if (user.role === "ORGANIZER") {
    const organizer = await prisma.eventOrganizer.findUnique({
      where: { user_id: user.id },
    });
    if (!organizer || organizer.id !== event.event_organizer_id)
      throw {
        status: 403,
        message: "You are not allowed to delete this event",
      };
  }

  return deleteEventRepo(eventId);
};
