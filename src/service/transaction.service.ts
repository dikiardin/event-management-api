import { prisma } from "../config/prisma";
import { TransactionRepository } from "../repositories/transaction.repository";
import { $Enums } from "../generated/prisma";
import { cloudinaryUpload } from "../config/cloudinary";

export class TransactionService {
  // create new transaction
  public static async createTransactionService(
    userId: number,
    tickets: { ticket_id: number; qty: number }[],
    couponId?: number,
    voucherId?: number,
    pointId?: number
  ) {
    if (!tickets || tickets.length === 0)
      throw new Error("Tickets cannot be empty");

    // subtotal (before discount)
    let subtotal = 0;
    let eventId: number | null = null;
    for (const t of tickets) {
      const ticket = await prisma.ticket.findUnique({
        where: { id: t.ticket_id },
      });
      if (!ticket) throw new Error(`Ticket ${t.ticket_id} not found`);
      if (ticket.available_qty < t.qty)
        throw new Error(`Not enough seats for ticket ${t.ticket_id}`);
      if (!eventId) {
        eventId = ticket.event_id;
      } else if (eventId !== ticket.event_id) {
        throw new Error("All tickets must belong to the same event");
      }
      subtotal += ticket.price * t.qty;
    }

    // voucher
    let discountVoucher = 0;
    if (voucherId) {
      const voucher = await prisma.voucher.findUnique({
        where: { id: voucherId },
      });
      if (!voucher) throw new Error("Voucher not found");
      if (voucher.voucher_end_date < new Date())
        throw new Error("Voucher expired");
      if (voucher.event_id !== eventId)
        throw new Error("Voucher does not belong to this event");
      discountVoucher = voucher.discount_value;
    }

    // coupon
    let discountCoupon = 0;
    if (couponId) {
      const coupon = await prisma.coupon.findUnique({
        where: { id: couponId },
      });
      if (!coupon) throw new Error("Coupon not found");
      if (coupon.user_id !== userId)
        throw new Error("Coupon not valid for this user");
      const threeMonthsAfter = new Date(coupon.created_at);
      threeMonthsAfter.setMonth(threeMonthsAfter.getMonth() + 3);
      if (new Date() > threeMonthsAfter) throw new Error("Coupon expired");
      discountCoupon = coupon.discount_value;
    }

    // points
    let discountPoint = 0;
    if (pointId) {
      const point = await prisma.point.findUnique({ where: { id: pointId } });
      if (!point) throw new Error("Point not found");
      if (point.user_id !== userId)
        throw new Error("Point not valid for this user");
      if (point.point_expired < new Date()) throw new Error("Point expired");
      discountPoint = point.point_balance;
    }

    // total price
    const voucherDiscountAmount = subtotal * (discountVoucher / 100);
    const couponDiscountAmount = subtotal * (discountCoupon / 100);
    const totalPrice =
      subtotal - discountPoint - voucherDiscountAmount - couponDiscountAmount;

    // expired in 2h
    const transaction_expired = new Date();
    transaction_expired.setHours(transaction_expired.getHours() + 2);

    // create transaction
    const transaction = await TransactionRepository.createTransactionRepo({
      user_id: userId,
      coupon_id: couponId ?? null,
      voucher_id: voucherId ?? null,
      point_id: pointId ?? null,
      points_used: discountPoint,
      discount_voucher: discountVoucher,
      discount_coupon: discountCoupon,
      total_price: totalPrice,
      transaction_expired,
    });

    // remove coupon & points
    if (couponId) await prisma.coupon.delete({ where: { id: couponId } });
    if (pointId) await prisma.point.delete({ where: { id: pointId } });

    // reduce ticket qty + event seats
    for (const t of tickets) {
      const ticket = await prisma.ticket.findUnique({
        where: { id: t.ticket_id },
      });
      if (!ticket) continue;

      await prisma.transactionTicket.create({
        data: {
          transaction_id: transaction.id,
          ticket_id: t.ticket_id,
          qty: t.qty,
          subtotal_price: ticket.price * t.qty,
        },
      });

      await prisma.ticket.update({
        where: { id: t.ticket_id },
        data: { available_qty: ticket.available_qty - t.qty },
      });

      await prisma.event.update({
        where: { id: ticket.event_id },
        data: { available_seats: { decrement: t.qty } },
      });
    }

    return transaction;
  }

  // upload payment proof
  public static async uploadPaymentProofService(
    transactionId: number,
    file: Express.Multer.File,
    userId: number
  ) {
    if (!file) throw { status: 400, message: "No file provided" };
    const result = await cloudinaryUpload(file);

    return TransactionRepository.uploadPaymentProofRepo(
      transactionId,
      result.secure_url,
      userId
    );
  }

  // rollback seats
  private static async rollbackSeatsAndTickets(transactionId: number) {
    const transaction = await TransactionRepository.getTransactionByIdRepo(
      transactionId
    );
    if (!transaction) throw new Error("Transaction not found");

    for (const t of transaction.tickets) {
      const ticket = await prisma.ticket.update({
        where: { id: t.ticket_id },
        data: { available_qty: { increment: t.qty } },
      });

      await prisma.event.update({
        where: { id: ticket.event_id },
        data: { available_seats: { increment: t.qty } },
      });
    }
  }

  // cancel by user
  public static async cancelTransactionService(
    transactionId: number,
    userId: number
  ) {
    const transaction = await TransactionRepository.getTransactionByIdRepo(
      transactionId
    );
    if (!transaction) throw new Error("Transaction not found");
    if (transaction.user_id !== userId) throw new Error("Unauthorized cancel");

    await this.rollbackSeatsAndTickets(transactionId);
    return TransactionRepository.updateTransactionRepo(transactionId, {
      status: $Enums.PaymentStatusType.CANCELLED,
    });
  }

  // auto expire 2h
  public static async autoExpireTransactionsService() {
    const expiredTransactions =
      await TransactionRepository.getExpiredTransactionsRepo();
    for (const tx of expiredTransactions) {
      await this.rollbackSeatsAndTickets(tx.id);
      await TransactionRepository.updateTransactionRepo(tx.id, {
        status: $Enums.PaymentStatusType.EXPIRED,
      });
    }
  }

  // auto cancel 3d
  public static async autoCancelAdminPendingService() {
    const pendingTransactions =
      await TransactionRepository.getPendingAdminTransactionsRepo();
    for (const tx of pendingTransactions) {
      await this.rollbackSeatsAndTickets(tx.id);
      await TransactionRepository.updateTransactionRepo(tx.id, {
        status: $Enums.PaymentStatusType.CANCELLED,
      });
    }
  }

  public static async getTransactionsByUserIdService(userId: number) {
    return TransactionRepository.getTransactionsByUserIdRepo(userId);
  }

  public static async getTransactionsByEventIdService(eventId: number) {
    return TransactionRepository.getTransactionsByEventIdRepo(eventId);
  }

  // New methods for organizer transaction management
  public static async getOrganizerTransactionsService(organizerId: number) {
    return TransactionRepository.getOrganizerTransactionsRepo(organizerId);
  }

  // Alternative method for debugging and testing
  public static async getOrganizerTransactionsSimpleService(
    organizerId: number
  ) {
    return TransactionRepository.getOrganizerTransactionsSimpleRepo(
      organizerId
    );
  }

  public static async getOrganizerTransactionsByStatusService(
    organizerId: number,
    status: string
  ) {
    // Validate status
    const validStatuses = Object.values($Enums.PaymentStatusType);
    if (!validStatuses.includes(status as $Enums.PaymentStatusType)) {
      throw new Error("Invalid payment status");
    }

    return TransactionRepository.getOrganizerTransactionsByStatusRepo(
      organizerId,
      status as $Enums.PaymentStatusType
    );
  }

  public static async acceptTransactionService(
    transactionId: number,
    organizerId: number
  ) {
    try {
      const transaction = await TransactionRepository.acceptTransactionRepo(
        transactionId,
        organizerId
      );

      // Log the acceptance for audit purposes
      console.log(
        `Transaction ${transactionId} accepted by organizer ${organizerId}`
      );

      return transaction;
    } catch (error) {
      throw error;
    }
  }

  public static async rejectTransactionService(
    transactionId: number,
    organizerId: number,
    rejectionReason?: string
  ) {
    try {
      const transaction = await TransactionRepository.rejectTransactionRepo(
        transactionId,
        organizerId,
        rejectionReason
      );

      // Log the rejection for audit purposes
      console.log(
        `Transaction ${transactionId} rejected by organizer ${organizerId}. Reason: ${
          rejectionReason || "No reason provided"
        }`
      );

      return transaction;
    } catch (error) {
      throw error;
    }
  }

  public static async getTransactionPaymentProofService(
    transactionId: number,
    organizerId: number
  ) {
    return TransactionRepository.getTransactionPaymentProofRepo(
      transactionId,
      organizerId
    );
  }

  public static async getOrganizerTransactionStatsService(organizerId: number) {
    const allTransactions =
      await TransactionRepository.getOrganizerTransactionsRepo(organizerId);

    const stats = {
      total: allTransactions.length,
      waiting_confirmation: 0,
      success: 0,
      rejected: 0,
      expired: 0,
      cancelled: 0,
      total_revenue: 0,
      pending_revenue: 0,
    };

    allTransactions.forEach((transaction) => {
      stats[transaction.status.toLowerCase() as keyof typeof stats]++;

      if (transaction.status === $Enums.PaymentStatusType.SUCCESS) {
        stats.total_revenue += transaction.total_price;
      } else if (
        transaction.status === $Enums.PaymentStatusType.WAITING_CONFIRMATION
      ) {
        stats.pending_revenue += transaction.total_price;
      }
    });

    return stats;
  }
}