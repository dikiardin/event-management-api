import { Request, Response, NextFunction } from "express";
import {
  updateProfileService,
  changePasswordService,
  resetPasswordService,
  uploadProfileImgService,
} from "../service/profile.service";

export default class ProfileController {
  public updateProfile = async (
    req: Request,
    res: Response,
    next: NextFunction
  ) => {
    try {
      const userId = parseInt(res.locals.decrypt.id);
      const data = req.body;

      const updated = await updateProfileService(userId, data);
      res.status(200).json({
        success: true,
        message: "Profile updated successfully",
        data: updated,
      });
    } catch (error: any) {
      next(error);
    }
  };

  public uploadProfileImg = async (
    req: Request,
    res: Response,
    next: NextFunction
  ) => {
    try {
      const userId = parseInt(res.locals.decrypt.id);
      const updated = await uploadProfileImgService(userId, req.file!);

      res.status(201).json({
        success: true,
        message: "Profile image uploaded successfully",
        data: updated,
      });
    } catch (error: any) {
      next(error);
    }
  };

  public changePassword = async (
    req: Request,
    res: Response,
    next: NextFunction
  ) => {
    try {
      const userId = parseInt(res.locals.decrypt.id);
      const { oldPassword, newPassword } = req.body;

      if (!oldPassword || !newPassword) {
        return res
          .status(400)
          .json({ success: false, message: "Old and new password required" });
      }

      const result = await changePasswordService(
        userId,
        oldPassword,
        newPassword
      );
      res.status(200).json({ success: true, ...result });
    } catch (error: any) {
      next(error);
    }
  };

  public resetPassword = async (
    req: Request,
    res: Response,
    next: NextFunction
  ) => {
    try {
      const userId = parseInt(res.locals.decrypt.id);
      const { newPassword } = req.body;

      if (!newPassword) {
        return res
          .status(400)
          .json({ success: false, message: "New password required" });
      }

      const result = await resetPasswordService(userId, newPassword);
      res.status(200).json({ success: true, ...result });
    } catch (error: any) {
      next(error);
    }
  };
}
