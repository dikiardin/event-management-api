import { prisma } from "../config/prisma";
import { PaymentStatusType } from "../generated/prisma";

export class TransactionRepository {
  // public static async createTransaction(data: {
  //   user_id: number;
  //   coupon_id?: number | null;
  //   voucher_id?: number | null;
  //   point_id?: number | null;
  //   points_used?: number;
  //   discount_voucher?: number;
  //   discount_coupon?: number;
  //   total_price?: number;
  //   transaction_expired: Date;
  // }) {
  //   return prisma.transactions.create({
  //     data: {
  //       user_id: data.user_id,
  //       coupon_id: data.coupon_id ?? null,
  //       voucher_id: data.voucher_id ?? null,
  //       point_id: data.point_id ?? null,
  //       points_used: data.points_used ?? 0,
  //       discount_voucher: data.discount_voucher ?? 0,
  //       discount_coupon: data.discount_coupon ?? 0,
  //       total_price: data.total_price ?? 0,
  //       status: PaymentStatusType.WAITING_PAYMENT,
  //       transaction_expired: data.transaction_expired,
  //     },
  //   });
  // }
  public static async createTransaction(data: {
  user_id: number;
  coupon_id?: number | null;
  voucher_id?: number | null;
  point_id?: number | null;
  points_used?: number;
  discount_voucher?: number;
  discount_coupon?: number;
  total_price?: number;
  transaction_expired: Date;
}) {
  return prisma.transactions.create({
    data: {
      user_id: data.user_id,
      coupon_id: data.coupon_id ?? null,
      voucher_id: data.voucher_id ?? null,
      point_id: data.point_id ?? null,
      points_used: data.points_used ?? 0,
      discount_voucher: data.discount_voucher ?? 0,
      discount_coupon: data.discount_coupon ?? 0,
      total_price: data.total_price ?? 0,
      status: PaymentStatusType.WAITING_PAYMENT,
      transaction_expired: data.transaction_expired,
    },
  });
}

  public static async getTransactionById(id: number) {
    return prisma.transactions.findUnique({
      where: { id },
      include: { tickets: true, user: true, voucher: true, coupon: true },
    });
  }

  public static async updateTransaction(id: number, data: any) {
    // update transaction status
    return prisma.transactions.update({
      where: { id },
      data,
    });
  }

  public static async uploadPaymentProof(
    transactionId: number,
    proofUrl: string
  ) {
    return prisma.transactions.update({
      where: { id: transactionId },
      data: {
        payment_proof_url: proofUrl,
        status: PaymentStatusType.WAITING_CONFIRMATION,
        is_accepted: false,
        transaction_date_time: new Date(),
      },
    });
  }

  public static async getExpiredTransactions() {
    const now = new Date();
    return prisma.transactions.findMany({
      where: {
        status: PaymentStatusType.WAITING_PAYMENT,
        transaction_expired: { lte: now },
      },
    });
  }

  public static async getPendingAdminTransactions() {
    const threeDaysAgo = new Date(Date.now() - 3 * 24 * 60 * 60 * 1000);
    return prisma.transactions.findMany({
      where: {
        status: PaymentStatusType.WAITING_CONFIRMATION,
        transaction_date_time: { lte: threeDaysAgo },
      },
    });
  }
}