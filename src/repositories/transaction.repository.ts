import { prisma } from "../config/prisma";
import { PaymentStatusType } from "../generated/prisma";

const FINAL_STATUSES: PaymentStatusType[] = [
  // status that cant be changed
  PaymentStatusType.SUCCESS,
  PaymentStatusType.REJECTED,
  PaymentStatusType.EXPIRED,
  PaymentStatusType.CANCELLED,
];

const BLOCKED_UPLOAD_STATUSES: PaymentStatusType[] = [
  PaymentStatusType.SUCCESS,
  PaymentStatusType.REJECTED,
  PaymentStatusType.EXPIRED,
  PaymentStatusType.CANCELLED,
  PaymentStatusType.WAITING_CONFIRMATION, // blocked re-upload the proof
];

export class TransactionRepository {
  public static async createTransactionRepo(data: {
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
    return prisma.transactions.update({
      where: { id },
      data,
    });
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
        `Transaction already ${transaction.status}, cannot upload proof again`
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
    const now = new Date();
    return prisma.transactions.findMany({
      where: {
        status: PaymentStatusType.WAITING_PAYMENT,
        transaction_expired: { lte: now },
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
        tickets: {
          include: {
            ticket: {
              include: { event: true },
            },
          },
        },
        coupon: true,
        voucher: true,
        point: true,
      },
    });
  }

  public static async getTransactionsByEventIdRepo(eventId: number) {
    return prisma.transactions.findMany({
      where: {
        tickets: {
          every: {
            ticket: {
              event_id: eventId,
            },
          },
        },
      },
      include: {
        user: true,
        tickets: {
          include: {
            ticket: {
              include: { event: true },
            },
          },
        },
        coupon: true,
        voucher: true,
        point: true,
      },
    });
  }
}
