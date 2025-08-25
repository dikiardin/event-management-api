// import { Request, Response, NextFunction } from "express";
// import {
//   generateReferralService,
//   useReferralService,
// } from "../service/referral.service";

// export default class ReferralController {
//   // Generate atau ambil referral code user
//   public async generateReferral(
//     req: Request,
//     res: Response,
//     next: NextFunction
//   ) {
//     try {
//       const user = res.locals.decrypt; // pastikan user sudah didecrypt dari token
//       const referral = await generateReferralService(user);

//       return res.status(200).json({
//         success: true,
//         message: "Referral code generated successfully",
//         data: {
//           id: referral.id,
//           username: referral.username,
//           referral_code: referral.referral_code,
//         },
//       });
//     } catch (error: any) {
//       next(error);
//     }
//   }

//   // Gunakan referral code saat user baru mendaftar
//   public async useReferral(req: Request, res: Response, next: NextFunction) {
//     try {
//       const { referralCode } = req.body;
//       const newUser = res.locals.decrypt; // user baru setelah signup

//       if (!referralCode || typeof referralCode !== "string") {
//         return res.status(400).json({
//           success: false,
//           message: "Invalid referral code",
//         });
//       }

//       const result = await useReferralService(referralCode, newUser);

//       return res.status(200).json({
//         success: true,
//         message: result.message,
//         data: {
//           referredBy: result.referredBy,
//           reward: result.reward,
//         },
//       });
//     } catch (error: any) {
//       next(error);
//     }
//   }
// }
