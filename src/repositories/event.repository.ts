import { prisma } from "../config/prisma";
import { CategoryType } from "../generated/prisma";

export const createEventRepo = async (userId: number, data: any) => {
  // get lowest ticket price
  const minPrice = Math.min(...data.tickets.map((ticket: any) => ticket.price));

  return prisma.event.create({
    data: {
      event_name: data.event_name,
      event_description: data.event_description,
      event_start_date: new Date(data.event_start_date),
      event_end_date: new Date(data.event_end_date),
      event_location: data.event_location,
      event_thumbnail: data.event_thumbnail,
      event_category: data.event_category,
      total_seats: data.total_seats,
      available_seats: data.total_seats,
      event_organizer_id: userId,
      event_price: minPrice, 

      tickets: {
        createMany: {
          data: data.tickets.map((ticket: any) => ({
            ticket_type: ticket.ticket_type,
            price: ticket.price,
            quota: ticket.quota,
            available_qty: ticket.available_qty ?? ticket.quota,
          })),
        },
      },
    },
    include: {
      tickets: true,
    },
  });
};

export const findAllEventsRepo = async (category?: string) => {
  return prisma.event.findMany({
    where: category
      ? { event_category: category.toUpperCase() as CategoryType }
      : {},
    include: {
      organizer: true,
      tickets: true,
      vouchers: true,
      reviews: true,
    },
  });
};

export const findEventByIdRepo = async (id: number) => {
  return prisma.event.findUnique({
    where: { id },
    include: {
      organizer: true,
      tickets: true,
      vouchers: true,
      reviews: true,
    },
  });
};

export const findEventByTitleRepo = async (title: string) => {
  return prisma.event.findFirst({
    where: { event_name: title },
    include: {
      organizer: true,
      tickets: true,
      vouchers: true,
      reviews: true,
    },
  });
};

export const updateEventRepo = async (id: number, data: any) => {
  return prisma.event.update({
    where: { id },
    data,
  });
};

export const deleteEventRepo = async (id: number) => {
  return prisma.event.delete({
    where: { id },
  });
};
