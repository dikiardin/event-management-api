import { NextFunction, Request, Response } from "express";
import { PointService } from "../service/point.service";

export class PointController {
  public async getPointsByUser(req: Request, res: Response, next:NextFunction) {
    try {
      const userId = Number(req.params.user_id);
      const points = await PointService.getPointsByUserIdService(userId);
      res.status(200).json(points);
    } catch (error) {
      next(error)
    }
  }
}