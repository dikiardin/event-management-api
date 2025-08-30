import { prisma } from "../config/prisma";
import { PaymentStatusType } from "../generated/prisma";

const FINAL_STATUSES: PaymentStatusType[] = [
  PaymentStatusType.SUCCESS,
  PaymentStatusType.REJECTED,
  PaymentStatusType.EXPIRED,
  PaymentStatusType.CANCELLED,
];

const BLOCKED_UPLOAD_STATUSES: PaymentStatusType[] = [
  ...FINAL_STATUSES,
  PaymentStatusType.WAITING_CONFIRMATION,
];

export class TransactionRepository {
  // repositories/transaction.repository.ts
  public static async createTransactionRepo(
    userId: number,
    totalPrice: number,
    transactionExpired: Date,
    pointsUsed: number = 0,
    discountVoucher: number = 0,
    discountCoupon: number = 0,
    couponId?: number,
    voucherId?: number,
    pointId?: number
  ) {
    return prisma.transactions.create({
      data: {
        user_id: userId,
        coupon_id: couponId ?? null,
        voucher_id: voucherId ?? null,
        point_id: pointId ?? null,
        points_used: pointsUsed,
        discount_voucher: discountVoucher,
        discount_coupon: discountCoupon,
        total_price: totalPrice,
        status: PaymentStatusType.WAITING_PAYMENT,
        transaction_expired: transactionExpired,
      },
    });
  }

  public static async getTransactionByIdRepo(id: number) {
    return prisma.transactions.findUnique({
      where: { id },
      include: { tickets: true, user: true, voucher: true, coupon: true },
    });
  }

  public static async updateTransactionRepo(id: number, data: any) {
    const transaction = await prisma.transactions.findUnique({ where: { id } });
    if (!transaction) throw new Error("Transaction not found");
    if (FINAL_STATUSES.includes(transaction.status)) {
      throw new Error(
        `Transaction already ${transaction.status}, cannot be updated`
      );
    }
    return prisma.transactions.update({ where: { id }, data });
  }

  public static async uploadPaymentProofRepo(
    transactionId: number,
    proofUrl: string
  ) {
    const transaction = await prisma.transactions.findUnique({
      where: { id: transactionId },
    });
    if (!transaction) throw new Error("Transaction not found");
    if (
      BLOCKED_UPLOAD_STATUSES.includes(transaction.status as PaymentStatusType)
    ) {
      throw new Error(
        `Transaction already ${transaction.status}, cannot upload proof`
      );
    }
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

  public static async getExpiredTransactionsRepo() {
    return prisma.transactions.findMany({
      where: {
        status: PaymentStatusType.WAITING_PAYMENT,
        transaction_expired: { lte: new Date() },
      },
    });
  }

  public static async getPendingAdminTransactionsRepo() {
    const threeDaysAgo = new Date(Date.now() - 3 * 24 * 60 * 60 * 1000);
    return prisma.transactions.findMany({
      where: {
        status: PaymentStatusType.WAITING_CONFIRMATION,
        transaction_date_time: { lte: threeDaysAgo },
      },
    });
  }

  public static async getTransactionsByUserIdRepo(userId: number) {
    return prisma.transactions.findMany({
      where: { user_id: userId },
      include: {
        tickets: { include: { ticket: { include: { event: true } } } },
        coupon: true,
        voucher: true,
        point: true,
      },
    });
  }

  public static async getTransactionsByEventIdRepo(eventId: number) {
    return prisma.transactions.findMany({
      where: { tickets: { every: { ticket: { event_id: eventId } } } },
      include: {
        user: true,
        tickets: { include: { ticket: { include: { event: true } } } },
        coupon: true,
        voucher: true,
        point: true,
      },
    });
  }
}
