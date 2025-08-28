import {
  findUserByReferralCodeRepo,
  updateUserReferralCodeRepo,
  createPointRepo,
  createCouponRepo,
} from "../repositories/referral.repository";
import { v4 as uuidv4 } from "uuid";

// Utility to add calendar months (handles month length correctly)
const addMonths = (date: Date, months: number) => {
  const result = new Date(date);
  const d = result.getDate();
  result.setMonth(result.getMonth() + months);
  // Handle cases where the original date was at the end of the month
  if (result.getDate() !== d) {
    result.setDate(0);
  }
  return result;
};

// Generate referral code untuk user baru
export const generateReferralService = async (user: any) => {
  if (!user) throw { status: 401, message: "Unauthorized" };

  if (!user.referral_code) {
    const referralCode = uuidv4().slice(0, 8).toUpperCase();
    return updateUserReferralCodeRepo(user.id, referralCode);
  }

  return user;
};

// Gunakan referral code saat user baru daftar
export const useReferralService = async (
  referralCode: string,
  newUser: any
) => {
  if (!newUser) throw { status: 401, message: "Unauthorized" };
  if (!referralCode)
    throw { status: 400, message: "Referral code is required" };

  // Cari user (referrer)
  const referrer = await findUserByReferralCodeRepo(referralCode);
  if (!referrer) throw { status: 404, message: "Referral code not found" };

  // Pastikan user tidak pakai kode referral miliknya sendiri
  if (referrer.id === newUser.id) {
    throw { status: 400, message: "You cannot use your own referral code" };
  }

  // 🎁 Kasih reward poin ke referrer (expire 3 bulan)
  await createPointRepo(referrer.id, 10000, addMonths(new Date(), 3));

  // 🎟️ Kasih kupon ke user baru (diskon 10%)
  await createCouponRepo(
    newUser.id,
    `DISC-${uuidv4().slice(0, 6).toUpperCase()}`,
    10
  );

  return {
    message: "Referral applied successfully",
    referredBy: referrer.username,
    reward: {
      referrerPoints: 10000,
      newUserCoupon: "10% Discount (valid 3 months)",
    },
  };
};
