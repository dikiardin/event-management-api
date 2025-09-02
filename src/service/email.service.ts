import { transport } from "../config/nodemailer";
import {
  createTransactionAcceptedEmail,
  createTransactionRejectedEmail,
  TransactionEmailData,
} from "../utils/emailTemplates";
import { prisma } from "../config/prisma";

export class EmailService {
  /**
   * Send transaction accepted notification email
   */
  public static async sendTransactionAcceptedEmail(
    transactionId: number,
    userEmail: string
  ): Promise<void> {
    try {
      // Get transaction details with all related data
      const transaction = await prisma.transactions.findUnique({
        where: { id: transactionId },
        include: {
          user: true,
          tickets: {
            include: {
              ticket: {
                include: {
                  event: true,
                },
              },
            },
          },
          voucher: true,
          coupon: true,
          point: true,
        },
      });

      if (!transaction) {
        throw new Error(`Transaction ${transactionId} not found`);
      }

      if (!transaction.user) {
        throw new Error(`User not found for transaction ${transactionId}`);
      }

      // Get event details from the first ticket
      const firstTicket = transaction.tickets[0];
      if (!firstTicket) {
        throw new Error(`No tickets found for transaction ${transactionId}`);
      }

      const event = firstTicket.ticket.event;

      // Prepare ticket details
      const ticketDetails = transaction.tickets.map((t) => ({
        ticketType: t.ticket.ticket_type,
        quantity: t.qty,
        price: t.subtotal_price,
      }));

      // Prepare email data
      const emailData: TransactionEmailData = {
        username: transaction.user.username,
        eventName: event.event_name,
        eventLocation: event.event_location,
        eventDate: event.event_start_date.toLocaleDateString("id-ID", {
          weekday: "long",
          year: "numeric",
          month: "long",
          day: "numeric",
          hour: "2-digit",
          minute: "2-digit",
        }),
        transactionId: transaction.id,
        totalPrice: transaction.total_price,
        ticketDetails,
        pointsUsed: transaction.points_used,
        voucherUsed: transaction.voucher
          ? {
              discountValue: transaction.discount_voucher,
              voucherCode: transaction.voucher.voucher_code,
            }
          : undefined,
        couponUsed: transaction.coupon
          ? {
              discountValue: transaction.discount_coupon,
              couponCode: transaction.coupon.coupon_code,
            }
          : undefined,
      };

      // Generate email HTML
      const emailHtml = createTransactionAcceptedEmail(emailData);

      // Send email
      await transport.sendMail({
        to: userEmail,
        subject: `✅ Payment Confirmed - ${event.event_name} | TicketNest`,
        html: emailHtml,
      });

      console.log(
        `Transaction accepted email sent to ${userEmail} for transaction ${transactionId}`
      );
    } catch (error) {
      console.error(
        `Failed to send transaction accepted email for transaction ${transactionId}:`,
        error
      );
      throw error;
    }
  }

  /**
   * Send transaction rejected notification email
   */
  public static async sendTransactionRejectedEmail(
    transactionId: number,
    userEmail: string,
    rejectionReason?: string
  ): Promise<void> {
    try {
      // Get transaction details with all related data
      const transaction = await prisma.transactions.findUnique({
        where: { id: transactionId },
        include: {
          user: true,
          tickets: {
            include: {
              ticket: {
                include: {
                  event: true,
                },
              },
            },
          },
          voucher: true,
          coupon: true,
          point: true,
        },
      });

      if (!transaction) {
        throw new Error(`Transaction ${transactionId} not found`);
      }

      if (!transaction.user) {
        throw new Error(`User not found for transaction ${transactionId}`);
      }

      // Get event details from the first ticket
      const firstTicket = transaction.tickets[0];
      if (!firstTicket) {
        throw new Error(`No tickets found for transaction ${transactionId}`);
      }

      const event = firstTicket.ticket.event;

      // Prepare ticket details
      const ticketDetails = transaction.tickets.map((t) => ({
        ticketType: t.ticket.ticket_type,
        quantity: t.qty,
        price: t.subtotal_price,
      }));

      // Prepare email data
      const emailData: TransactionEmailData = {
        username: transaction.user.username,
        eventName: event.event_name,
        eventLocation: event.event_location,
        eventDate: event.event_start_date.toLocaleDateString("id-ID", {
          weekday: "long",
          year: "numeric",
          month: "long",
          day: "numeric",
          hour: "2-digit",
          minute: "2-digit",
        }),
        transactionId: transaction.id,
        totalPrice: transaction.total_price,
        ticketDetails,
        rejectionReason,
        pointsUsed: transaction.points_used,
        voucherUsed: transaction.voucher
          ? {
              discountValue: transaction.discount_voucher,
              voucherCode: transaction.voucher.voucher_code,
            }
          : undefined,
        couponUsed: transaction.coupon
          ? {
              discountValue: transaction.discount_coupon,
              couponCode: transaction.coupon.coupon_code,
            }
          : undefined,
      };

      // Generate email HTML
      const emailHtml = createTransactionRejectedEmail(emailData);

      // Send email
      await transport.sendMail({
        to: userEmail,
        subject: `❌ Payment Rejected - ${event.event_name} | TicketNest`,
        html: emailHtml,
      });

      console.log(
        `Transaction rejected email sent to ${userEmail} for transaction ${transactionId}`
      );
    } catch (error) {
      console.error(
        `Failed to send transaction rejected email for transaction ${transactionId}:`,
        error
      );
      throw error;
    }
  }

  /**
   * Send bulk transaction notifications (for testing or batch processing)
   */
  public static async sendBulkTransactionNotifications(
    transactionIds: number[],
    type: "accepted" | "rejected",
    rejectionReason?: string
  ): Promise<void> {
    const promises = transactionIds.map(async (transactionId) => {
      try {
        // Get user email from transaction
        const transaction = await prisma.transactions.findUnique({
          where: { id: transactionId },
          include: { user: true },
        });

        if (!transaction || !transaction.user) {
          console.error(`Transaction ${transactionId} or user not found`);
          return;
        }

        if (type === "accepted") {
          await this.sendTransactionAcceptedEmail(
            transactionId,
            transaction.user.email
          );
        } else {
          await this.sendTransactionRejectedEmail(
            transactionId,
            transaction.user.email,
            rejectionReason
          );
        }
      } catch (error) {
        console.error(
          `Failed to send notification for transaction ${transactionId}:`,
          error
        );
      }
    });

    await Promise.allSettled(promises);
  }
}
