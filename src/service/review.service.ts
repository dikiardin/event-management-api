import { ReviewRepo } from "../repositories/review.repository";
import { CustomError } from "../utils/customError";

export class ReviewService {
  public static async createReview(
    user_id: number,
    event_id: number,
    rating: number,
    review_text?: string
  ) {
    // check rating must between 1 to 5
    if (rating < 1 || rating > 5) {
      throw new CustomError("Rating must be between 1 and 5.", 400);
    }

    // check if user has attended (success transaction + event finished)
    const transaction = await ReviewRepo.findUserTransactionForEvent(
      user_id,
      event_id
    );

    if (!transaction) {
      throw new CustomError(
        "You must attend the event before leaving a review.",
        403
      );
    }

    const firstTicket = transaction.tickets?.[0];
    if (!firstTicket || !firstTicket.ticket?.event) {
      throw new CustomError("Event data not found for this transaction.", 404);
    }

    const event = firstTicket.ticket.event;

    if (new Date(event.event_end_date) > new Date()) {
      throw new CustomError(
        "You can only review after the event has ended.",
        400
      );
    }

    // check if review already exists
    const existingReview = await ReviewRepo.findReviewByUserAndEvent(
      user_id,
      event_id
    );
    if (existingReview) {
      throw new CustomError("You have already reviewed this event.", 409);
    }

    // create new review
    return ReviewRepo.createReview({
      user_id,
      event_id,
      rating,
      ...(review_text ? { review_text } : {}),
    });
  }

  public static async getReviewsByEvent(event_id: number) {
    const reviews = await ReviewRepo.findReviewsByEvent(event_id);

    const avgRating =
      reviews.length > 0
        ? reviews.reduce((sum, r) => sum + r.rating, 0) / reviews.length
        : 0;

    return { reviews, avgRating: Number(avgRating.toFixed(2)) };
  }

  public static async getReviewsByOrganizer(organizer_id: number) {
    const reviews = await ReviewRepo.findReviewsByOrganizer(organizer_id);

    const avgRating =
      reviews.length > 0
        ? reviews.reduce((sum, r) => sum + r.rating, 0) / reviews.length
        : 0;

    return { reviews, avgRating: Number(avgRating.toFixed(2)) };
  }
}
