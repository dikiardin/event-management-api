import { Request, Response, NextFunction } from "express";
import { prisma } from "../config/prisma";
import {
  registerService,
  loginService,
  verifyEmailService,
  keepLoginService,
} from "../service/auth.service";
import { cloudinaryUpload } from "../config/cloudinary";

export default class AuthController {
  public async register(req: Request, res: Response, next: NextFunction) {
    try {
      const { email, password, username, role } = req.body;

      if (!email || !password || !username || !role) {
        return res.status(400).json({ message: "All fields are required" });
      }

      const user = await registerService({ email, password, username, role });

      return res.status(201).json({
        message: "User registered successfully. Please check your email.",
        user: {
          id: user.id,
          email: user.email,
          username: user.username,
          role: user.role,
          is_verified: user.is_verified,
        },
      });
    } catch (error: any) {
      return res.status(error.status || 500).json({
        message: error.message || "Internal Server Error",
      });
    }
  }

  public async login(req: Request, res: Response, next: NextFunction) {
    try {
      const { email, password } = req.body;
      const result = await loginService(email, password);
      res.status(200).json({ success: true, data: result });
    } catch (error) {
      next(error);
    }
  }

  public async verifyEmail(req: Request, res: Response, next: NextFunction) {
    try {
      const { token } = req.query;

      if (!token || typeof token !== "string") {
        return res.status(400).json({ message: "Invalid or missing token" });
      }

      const result = await verifyEmailService(token);

      return res.status(200).json({
        message: "Email verified successfully!",
        user: {
          id: result.user.id,
          email: result.user.email,
          username: result.user.username,
          role: result.user.role,
          is_verified: result.user.is_verified,
        },
      });
    } catch (error: any) {
      return res
        .status(400)
        .json({ message: error.message || "Invalid or expired token" });
    }
  }

  public async keepLogin(req: Request, res: Response, next: NextFunction) {
    try {
      const userId = parseInt(res.locals.decrypt.id);
      const result = await keepLoginService(userId);
      res.status(200).json({ success: true, data: result });
    } catch (error) {
      next(error);
    }
  }

  public async changeProfileImg(
    req: Request,
    res: Response,
    next: NextFunction
  ) {
    try {
      if (!req.file) {
        throw { code: 404, message: "No Exist file" };
      }
      const upload = await cloudinaryUpload(req.file);
      const update = await prisma.user.update({
        where: { id: parseInt(res.locals.decrypt.id) },
        data: { profile_pic: upload.secure_url },
      });

      res
        .status(200)
        .send({ success: true, message: "Change Image profile success" });
    } catch (error) {
      next(error);
    }
  }
}
