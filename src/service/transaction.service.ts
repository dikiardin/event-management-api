import { prisma } from "../config/prisma";
import { TransactionRepository } from "../repositories/transaction.repository";
import { PaymentStatusType } from "../generated/prisma";
import { cloudinaryUpload } from "../config/cloudinary";

export class TransactionService {
  public static async createTransaction(
    userId: number,
    tickets: { ticket_id: number; qty: number }[],
    pointsUsed = 0,
    couponId?: number,
    voucherId?: number,
    pointId?: number
  ) {
    if (!tickets || tickets.length === 0)
      throw new Error("Tickets cannot be empty");

    // Calculate subtotal
    let subtotal = 0;
    for (const t of tickets) {
      const ticket = await prisma.ticket.findUnique({
        where: { id: t.ticket_id },
      });
      if (!ticket) throw new Error(`Ticket ${t.ticket_id} not found`);
      if (ticket.available_qty < t.qty)
        throw new Error(`Not enough seats for ticket ${t.ticket_id}`);
      subtotal += ticket.price * t.qty;
    }

    // Apply voucher (percent)
    let discountVoucher = 0;
    if (voucherId) {
      const voucher = await prisma.voucher.findUnique({
        where: { id: voucherId },
      });
      if (!voucher) throw new Error("Voucher not found");
      if (voucher.voucher_end_date < new Date())
        throw new Error("Voucher expired");
      discountVoucher = voucher.discount_value; // e.g., 0.1 for 10%
    }

    // Apply coupon (percent)
    let discountCoupon = 0;
    if (couponId) {
      const coupon = await prisma.coupon.findUnique({
        where: { id: couponId },
      });
      if (!coupon) throw new Error("Coupon not found");
      if (coupon.user_id !== userId)
        throw new Error("Coupon does not belong to user");
      discountCoupon = coupon.discount_value; // e.g., 0.05 for 5%
    }
    
    // Apply point
    let discountPoint = 0;
    if (pointId) {
      const point = await prisma.point.findUnique({
        where: { id: pointId },
      });
      if (!point) throw new Error("Point not found");
      if (point.user_id !== userId)
        throw new Error("Point does not belong to user");
      discountPoint = point.point_balance; 
    }

    const voucherDiscountAmount = subtotal * (discountVoucher / 100);
    const couponDiscountAmount = subtotal * (discountCoupon / 100);

    // Final total price
    const totalPrice =
      subtotal - pointsUsed - voucherDiscountAmount - couponDiscountAmount;

    // Set transaction expiry (2 hours)
    const transaction_expired = new Date();
    transaction_expired.setHours(transaction_expired.getHours() + 2);

    // Create transaction
    const transaction = await TransactionRepository.createTransaction({
      user_id: userId,
      coupon_id: couponId ?? null,
      voucher_id: voucherId ?? null,
      points_used: pointsUsed,
      discount_voucher: discountVoucher,
      discount_coupon: discountCoupon,
      total_price: totalPrice,
      transaction_expired,
    });

    // Remove coupon after use
    if (couponId) {
      await prisma.coupon.delete({ where: { id: couponId } });
    }

    // Create transaction tickets and reduce seat quantity
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
    }

    // Deduct all points fully
    let actualPointsDeducted = 0;

    const userPoints = await prisma.point.findMany({
      where: {
        user_id: userId,
        point_expired: { gte: new Date() },
        point_balance: { gt: 0 },
      },
      orderBy: { point_expired: "asc" },
    });

    // Delete all point rows and sum their balances
    for (const pointRow of userPoints) {
      console.log(
        "Deleting point row id:",
        pointRow.id,
        "balance:",
        pointRow.point_balance
      );
      await prisma.point.delete({ where: { id: pointRow.id } });
    }

    // Record actual points used
    pointsUsed = actualPointsDeducted;

    return transaction;
  }

  // Upload payment proof (Cloudinary)
  public static async uploadPaymentProof(
    transactionId: number,
    file: Express.Multer.File
  ) {
    const result = await cloudinaryUpload(file);
    const transaction = await TransactionRepository.uploadPaymentProof(
      transactionId,
      result.secure_url
    );
    return transaction;
  }

  // Cancel transaction and rollback
  public static async cancelTransaction(transactionId: number) {
    const transaction = await TransactionRepository.getTransactionById(
      transactionId
    );
    if (!transaction) throw new Error("Transaction not found");

    // Rollback ticket quantities
    for (const t of transaction.tickets) {
      await prisma.ticket.update({
        where: { id: t.ticket_id },
        data: { available_qty: { increment: t.qty } },
      });
    }

    // Rollback points
    if (transaction.points_used > 0) {
      let remainingPoints = transaction.points_used;

      const userPoints = await prisma.point.findMany({
        where: {
          user_id: transaction.user_id,
          point_expired: { gte: new Date() },
        },
        orderBy: { point_expired: "asc" },
      });

      for (const pointRow of userPoints) {
        if (remainingPoints <= 0) break;
        const increment = remainingPoints;
        await prisma.point.update({
          where: { id: pointRow.id },
          data: { point_balance: pointRow.point_balance + increment },
        });
        remainingPoints -= increment;
      }
    }

    return TransactionRepository.updateTransaction(transactionId, {
      status: PaymentStatusType.CANCELLED,
    });
  }

  // Auto-expire transactions
  public static async autoExpireTransactions() {
    const expiredTransactions =
      await TransactionRepository.getExpiredTransactions();
    for (const tx of expiredTransactions) {
      await this.cancelTransaction(tx.id);
      await TransactionRepository.updateTransaction(tx.id, {
        status: PaymentStatusType.EXPIRED,
      });
    }
  }

  // Auto-cancel pending admin confirmations
  public static async autoCancelAdminPending() {
    const pendingTransactions =
      await TransactionRepository.getPendingAdminTransactions();
    for (const tx of pendingTransactions) {
      await this.cancelTransaction(tx.id);
    }
  }
}
