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

    // subtotal (before minus it with point, coupon, voucher)
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
        throw new Error(
          "All tickets in a transaction must belong to the same event"
        );
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
        throw new Error("Coupon does not belong to user");
      // Enforce 3-month validity from creation for referral coupons
      const threeMonthsAfter = new Date(coupon.created_at);
      threeMonthsAfter.setMonth(threeMonthsAfter.getMonth() + 3);
      if (new Date() > threeMonthsAfter) throw new Error("Coupon expired");
      discountCoupon = coupon.discount_value;
    }

    // points
    let discountPoint = 0;
    if (pointId) {
      const point = await prisma.point.findUnique({
        where: { id: pointId },
      });
      if (!point) throw new Error("Point not found");
      if (point.user_id !== userId)
        throw new Error("Point does not belong to user");
      if (point.point_expired < new Date()) throw new Error("Point expired");

      discountPoint = point.point_balance;
    }

    // discount
    const voucherDiscountAmount = subtotal * (discountVoucher / 100);
    const couponDiscountAmount = subtotal * (discountCoupon / 100);

    // total price
    const totalPrice =
      subtotal - discountPoint - voucherDiscountAmount - couponDiscountAmount;

    // transaction expired
    const transaction_expired = new Date();
    transaction_expired.setMinutes(transaction_expired.getMinutes() + 1);

    // create transaction
    const transaction = await TransactionRepository.createTransactionRepo(
      {
        user_id: userId,
        coupon_id: couponId ?? null,
        voucher_id: voucherId ?? null,
        point_id: pointId ?? null,
        points_used: discountPoint,
        discount_voucher: discountVoucher,
        discount_coupon: discountCoupon,
        total_price: totalPrice,
        transaction_expired,
        
      }
    );

    // remove coupon after use
    if (couponId) {
      await prisma.coupon.delete({ where: { id: couponId } });
    }

    // remove point after use
    if (pointId) {
      await prisma.point.delete({ where: { id: pointId } });
    }

    // reduce ticket qty + update event seats
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

      // decrement ticket qty
      await prisma.ticket.update({
        where: { id: t.ticket_id },
        data: { available_qty: ticket.available_qty - t.qty },
      });

      // decrement event available seats
      await prisma.event.update({
        where: { id: ticket.event_id },
        data: {
          available_seats: { decrement: t.qty },
        },
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

  // rollback seat and ticket
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

  // cancel transaction
  public static async cancelTransactionService(transactionId: number) {
    await this.rollbackSeatsAndTickets(transactionId); // rollback

    return TransactionRepository.updateTransactionRepo(transactionId, {
      status: $Enums.PaymentStatusType.CANCELLED,
    });
  }

  // auto expire transactions
  public static async autoExpireTransactionsService() {
    const expiredTransactions =
      await TransactionRepository.getExpiredTransactionsRepo();

    for (const tx of expiredTransactions) {
      await this.rollbackSeatsAndTickets(tx.id); // rollback

      await TransactionRepository.updateTransactionRepo(tx.id, {
        status: $Enums.PaymentStatusType.EXPIRED,
      });
    }
  }

  // auto cancel pending admin confirmations
  public static async autoCancelAdminPendingService() {
    const pendingTransactions =
      await TransactionRepository.getPendingAdminTransactionsRepo();

    for (const tx of pendingTransactions) {
      await this.rollbackSeatsAndTickets(tx.id); //rollback

      await TransactionRepository.updateTransactionRepo(tx.id, {
        status: $Enums.PaymentStatusType.CANCELLED,
      });
    }
  }

  // get transaction by user id
  public static async getTransactionsByUserIdService(userId: number) {
    return await TransactionRepository.getTransactionsByUserIdRepo(userId);
  }

  // get transaction by event id
  public static async getTransactionsByEventIdService(eventId: number) {
    return await TransactionRepository.getTransactionsByEventIdRepo(eventId);
  }
}
