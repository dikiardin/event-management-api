import { Router } from "express";
import { ReviewController } from "../controllers/review.controller";
import { verifyToken } from "../middleware/verifyToken";

export class ReviewRouter {
  private route: Router;
  private reviewController: typeof ReviewController;

  constructor() {
    this.route = Router();
    this.reviewController = ReviewController;
    this.initializeRoute();
  }

  private initializeRoute(): void {
    // create review
    this.route.post(
      "/:event_id",
      verifyToken,
      this.reviewController.createReview
    );

    // get reviews by event id
    this.route.get(
      "/event/:event_id",
      verifyToken,
      ReviewController.getReviewsByEvent
    );

    // get reviews by organizer id
    this.route.get(
      "/organizer/:organizer_id",
      verifyToken,
      ReviewController.getReviewsByOrganizer
    );
  }

  public getRouter(): Router {
    return this.route;
  }
}
