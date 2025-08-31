import { NextFunction, Request, Response } from "express";
import { ReviewService } from "../service/review.service";
import { ReviewRepo } from "../repositories/review.repository";

export class ReviewController {
  public static async createReview(req: Request, res: Response, next:NextFunction) {
    try {
      const user_id = (res.locals.decrypt as any).id; 
      const event_id = Number(req.params.event_id);   
      const { rating, review_text } = req.body;


      const review = await ReviewService.createReview(
        user_id,
        Number(event_id),
        Number(rating),
        review_text
      );

      res.status(201).json({
        success: true,
        message: "Review created successfully",
        data: review,
      });
    } catch (error) {
      next(error)
    }
  }

  public static async getReviewsByEvent(req: Request, res: Response, next: NextFunction) {
    try {
      const { event_id } = req.params;
      const { reviews, avgRating } = await ReviewService.getReviewsByEvent(Number(event_id));

      return res.status(200).json({
        success: true,
        avgRating,
        reviews,
      });
    } catch (error) {
      next(error);
    }
  }

  public static async getReviewsByOrganizer(req: Request, res: Response, next: NextFunction) {
    try {
      const { organizer_id } = req.params;
      const { reviews, avgRating } = await ReviewService.getReviewsByOrganizer(Number(organizer_id));

      return res.status(200).json({
        success: true,
        avgRating,
        reviews,
      });
    } catch (error) {
      next(error);
    }
  }
}