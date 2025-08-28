import { Request, Response, NextFunction } from "express";
import {
  registerService,
  loginService,
  verifyEmailService,
  keepLoginService,
} from "../service/auth.service";
import { useReferralService } from "../service/referral.service";

export default class AuthController {
  public async register(req: Request, res: Response, next: NextFunction) {
    try {
      const { email, password, username, role, referralCode } = req.body;

      if (!email || !password || !username || !role) {
        return res.status(400).json({ message: "All fields are required" });
      }

      // 1. Register user baru (referral_code otomatis di registerService)
      const user = await registerService({ email, password, username, role });

      let referralMessage = null;

      // 2. Jika user pakai referralCode saat daftar → gunakan service referral
      if (referralCode) {
        try {
          const result = await useReferralService(referralCode, user);
          // simpan pesan reward kupon
          referralMessage = `You received a ${result.reward.newUserCoupon}!`;
        } catch (referralError: any) {
          // Jangan blokir proses registrasi jika referral code invalid
          console.warn(
            "Referral error:",
            referralError.message || referralError
          );
        }
      }

      return res.status(201).json({
        message: "User registered successfully. Please check your email.",
        referralReward: referralMessage, // tampilkan pesan kupon
        user: {
          id: user.id,
          email: user.email,
          username: user.username,
          role: user.role,
          is_verified: user.is_verified,
          referral_code: user.referral_code,
        },
      });
    } catch (error: any) {
      next(error);
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
        return res.status(400).json({ message: "Invalid or missing link" });
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
      next(error);
      return res
        .status(400)
        .json({ message: error.message || "Invalid or session expired" });
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
}
