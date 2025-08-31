import { prisma } from "../config/prisma";
import { CategoryType } from "../generated/prisma";

export const createEventRepo = async (userId: number, data: any) => {
  // First get the organizer record
  const organizer = await prisma.eventOrganizer.findUnique({
    where: { user_id: userId },
  });

  if (!organizer) {
    throw {
      status: 404,
      message:
        "Organizer not found. Please complete your organizer profile first.",
    };
  }

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
      event_organizer_id: organizer.id, // Use organizer.id, not userId
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

export const findEventsByOrganizerRepo = async (userId: number) => {
  // First get the organizer record
  const organizer = await prisma.eventOrganizer.findUnique({
    where: { user_id: userId },
  });

  if (!organizer) {
    throw { status: 404, message: "Organizer not found" };
  }

  return prisma.event.findMany({
    where: { event_organizer_id: organizer.id },
    include: {
      organizer: true,
      tickets: {
        include: {
          transactionTickets: {
            include: {
              transaction: {
                include: {
                  user: {
                    select: {
                      id: true,
                      username: true,
                      email: true,
                    },
                  },
                },
              },
            },
          },
        },
      },
      vouchers: true,
      reviews: true,
    },
    orderBy: { created_at: "desc" },
  });
};

export const getOrganizerStatsRepo = async (userId: number) => {
  // First get the organizer record
  const organizer = await prisma.eventOrganizer.findUnique({
    where: { user_id: userId },
  });

  if (!organizer) {
    throw { status: 404, message: "Organizer not found" };
  }

  // Get all events by this organizer
  const events = await prisma.event.findMany({
    where: { event_organizer_id: organizer.id },
    include: {
      tickets: {
        include: {
          transactionTickets: {
            include: {
              transaction: true,
            },
          },
        },
      },
    },
  });

  // Calculate statistics
  const totalEvents = events.length;
  let totalRevenue = 0;
  let totalTicketsSold = 0;

  events.forEach((event) => {
    event.tickets.forEach((ticket) => {
      ticket.transactionTickets.forEach((transactionTicket) => {
        if (transactionTicket.transaction.status === "SUCCESS") {
          totalRevenue += transactionTicket.transaction.total_price;
          totalTicketsSold += transactionTicket.qty;
        }
      });
    });
  });

  const totalSeats = events.reduce((sum, event) => {
    return (
      sum +
      event.tickets.reduce((ticketSum, ticket) => {
        return ticketSum + ticket.quota;
      }, 0)
    );
  }, 0);

  const upcomingEvents = events.filter(
    (event) => new Date(event.event_start_date) > new Date()
  ).length;

  const completedEvents = events.filter(
    (event) => new Date(event.event_end_date) < new Date()
  ).length;

  return {
    totalEvents,
    totalRevenue,
    totalTicketsSold,
    totalSeats,
    upcomingEvents,
    completedEvents,
    averageRating: organizer.average_rating,
  };
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

  // Only recalculate seats if tickets are provided and valid
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

  // Remove tickets from updateData if it exists (tickets are managed separately)
  if (updateData.tickets) {
    delete updateData.tickets;
  }

  return prisma.event.update({
    where: { id },
    data: updateData,
  });
};

export const deleteEventRepo = async (id: number) => {
  // Use transaction to delete related records first, then delete event
  return prisma.$transaction(async (tx) => {
    // Delete related records first
    await tx.ticket.deleteMany({
      where: { event_id: id },
    });

    await tx.voucher.deleteMany({
      where: { event_id: id },
    });

    await tx.review.deleteMany({
      where: { event_id: id },
    });

    // Finally delete the event
    return tx.event.delete({
      where: { id },
    });
  });
};

export const getOrganizerTransactionsRepo = async (userId: number) => {
  // First get the organizer record
  const organizer = await prisma.eventOrganizer.findUnique({
    where: { user_id: userId },
  });

  if (!organizer) {
    throw { status: 404, message: "Organizer not found" };
  }

  // Get all transactions for events by this organizer through tickets
  const transactions = await prisma.transactions.findMany({
    where: {
      tickets: {
        some: {
          ticket: {
            event: {
              event_organizer_id: organizer.id,
            },
          },
        },
      },
    },
    include: {
      user: {
        select: {
          id: true,
          username: true,
          email: true,
        },
      },
      tickets: {
        include: {
          ticket: {
            include: {
              event: {
                select: {
                  id: true,
                  event_name: true,
                  event_start_date: true,
                },
              },
            },
          },
        },
      },
    },
    orderBy: { transaction_date_time: "desc" },
  });

  return transactions;
};
