import { prisma } from "../config/prisma";

// Cari user berdasarkan referral code
export const findUserByReferralCodeRepo = async (referralCode: string) => {
  return prisma.user.findUnique({
    where: { referral_code: referralCode },
  });
};

// Generate/update referral code user
export const updateUserReferralCodeRepo = async (
  userId: number,
  referralCode: string
) => {
  return prisma.user.update({
    where: { id: userId },
    data: { referral_code: referralCode },
  });
};

// Tambah poin ke referrer
export const createPointRepo = async (
  userId: number,
  points: number,
  expiredAt: Date
) => {
  return prisma.point.create({
    data: {
      user_id: userId,
      point_balance: points,
      point_expired: expiredAt, // sudah ada di schema
    },
  });
};

// Tambah kupon ke user baru
export const createCouponRepo = async (
  userId: number,
  couponCode: string,
  discount: number
) => {
  return prisma.coupon.create({
    data: {
      user_id: userId,
      coupon_code: couponCode,
      discount_value: discount,
      // expired logic akan dihitung saat digunakan, tidak disimpan di DB
    },
  });
};
