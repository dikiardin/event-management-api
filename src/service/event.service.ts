import {
  createEventRepo,
  findAllEventsRepo,
  findEventByIdRepo,
  updateEventRepo,
  deleteEventRepo,
} from "../repositories/event.repository";
import { prisma } from "../config/prisma";

export const createEventService = async (user: any, data: any) => {
  if (!user) throw { status: 401, message: "Unauthorized" };
  if (user.role !== "ORGANIZER")
    throw { status: 403, message: "Only organizer can create event" };

  const organizer = await prisma.eventOrganizer.findUnique({
    where: { user_id: user.id },
  });
  if (!organizer)
    throw { status: 403, message: "User is not registered as organizer" };

  return createEventRepo({
    ...data,
    event_organizer_id: organizer.id,
    available_seats: data.total_seats ?? 0,
  });
};

export const getEventsService = async (category?: string) => {
  return findAllEventsRepo(category);
};

export const getEventByIdService = async (id: number) => {
  const event = await findEventByIdRepo(id);
  if (!event) throw { status: 404, message: "Event not found" };
  return event;
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
