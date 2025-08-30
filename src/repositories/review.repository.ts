import { prisma } from "../config/prisma";

export class ReviewRepo {
  public static async createReview(data: {
    user_id: number;
    event_id: number;
    rating: number;
    review_text?: string;
  }) {
    return prisma.review.create({
      data,
    });
  }

  public static async findReviewByUserAndEvent(
    user_id: number,
    event_id: number
  ) {
    return prisma.review.findFirst({
      where: { user_id, event_id },
    });
  }

  public static async findUserTransactionForEvent(
    user_id: number,
    event_id: number
  ) {
    return prisma.transactions.findFirst({
      where: {
        user_id,
        status: "SUCCESS",
        tickets: {
          some: {
            ticket: {
              event_id: event_id,
            },
          },
        },
      },
      include: {
        tickets: {
          include: {
            ticket: {
              include: {
                event: true,
              },
            },
          },
        },
      },
    });
  }

  public static async findReviewsByEvent(event_id: number) {
    return prisma.review.findMany({
      where: { event_id },
      include: {
        user: true,
      },
      orderBy: { review_date: "desc" },
    });
  }

  public static async findReviewsByOrganizer(organizer_id: number) {
    return prisma.review.findMany({
      where: {
        event: {
          event_organizer_id: organizer_id,
        },
      },
      include: {
        event: true,
        user: true,
      },
      orderBy: { review_date: "desc" },
    });
  }
}
