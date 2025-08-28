import { prisma } from "../config/prisma";
import { CategoryType } from "../generated/prisma";

export const createEventRepo = async (userId: number, data: any) => {
  // get lowest ticket price to display it in the landing page
  const minPrice = Math.min(...data.tickets.map((ticket: any) => ticket.price));

  // calculate seats from tickets
  const totalSeats = data.tickets.reduce(
    (sum: number, t: any) => sum + t.quota,
    0
  );
  const availableSeats = data.tickets.reduce(
    (sum: number, t: any) => sum + (t.available_qty ?? t.quota),
    0
  );

  return prisma.event.create({
    data: {
      event_name: data.event_name,
      event_description: data.event_description,
      event_start_date: new Date(data.event_start_date),
      event_end_date: new Date(data.event_end_date),
      event_location: data.event_location,
      event_thumbnail: data.event_thumbnail,
      event_category: data.event_category,
      total_seats: totalSeats,
      available_seats: availableSeats,
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
  const event = await prisma.event.findUnique({
    where: { id },
    include: {
      organizer: true,
      tickets: true,
      vouchers: true,
      reviews: true,
    },
  });

  if (!event) return null;

  const availableSeats = event.tickets.reduce(
    (sum, t) => sum + t.available_qty,
    0
  );

  return {
    ...event,
    available_seats: availableSeats,
  };
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
  // recalc seats if tickets provided
  let updateData: any = { ...data };

  if (data.tickets && Array.isArray(data.tickets) && data.tickets.length > 0) {
    const totalSeats = data.tickets.reduce(
      (sum: number, t: any) => sum + t.quota,
      0
    );
    const availableSeats = data.tickets.reduce(
      (sum: number, t: any) => sum + (t.available_qty ?? t.quota),
      0
    );

    updateData.total_seats = totalSeats;
    updateData.available_seats = availableSeats;
  }

  return prisma.event.update({
    where: { id },
    data: updateData,
  });
};

export const deleteEventRepo = async (id: number) => {
  return prisma.event.delete({
    where: { id },
  });
};
