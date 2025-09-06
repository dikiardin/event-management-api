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
  // create transaction
  public static async createTransactionRepo(data: {
    user_id: number;
    coupon_id?: number | null;
    voucher_id?: number | null;
    point_id?: number | null;
    points_used?: number;
    discount_voucher?: number;
    discount_coupon?: number;
    total_price: number;
    transaction_expired: Date;
    status: string;
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
        total_price: data.total_price,
        transaction_expired: data.transaction_expired,
        status: data.status as PaymentStatusType,
      },
    });
  }

  public static async getTransactionByIdRepo(id: number) {
    return prisma.transactions.findUnique({
      where: { id },
      include: {
        user: true,
        voucher: true,
        coupon: true,
        tickets: {
          include: {
            ticket: {
              include: {
                event: true,
              },
            },
          },
        },
      },
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
    proofUrl: string,
    userId: number
  ) {
    const transaction = await prisma.transactions.findUnique({
      where: { id: transactionId },
    });
    if (!transaction) throw new Error("Transaction not found");
    if (transaction.user_id !== userId) throw new Error("Unauthorized");

    if (BLOCKED_UPLOAD_STATUSES.includes(transaction.status)) {
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

  public static async cancelTransactionRepo(
    transactionId: number,
    userId: number
  ) {
    const transaction = await prisma.transactions.findUnique({
      where: { id: transactionId },
    });
    if (!transaction) throw new Error("Transaction not found");
    if (transaction.user_id !== userId) throw new Error("Unauthorized");

    if (FINAL_STATUSES.includes(transaction.status)) {
      throw new Error(
        `Transaction already ${transaction.status}, cannot cancel`
      );
    }

    return prisma.transactions.update({
      where: { id: transactionId },
      data: { status: PaymentStatusType.CANCELLED },
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
      where: { user_id: Number(userId) },
      include: {
        user: true,
        tickets: { include: { ticket: { include: { event: true } } } },
        coupon: true,
        voucher: true,
        point: true,
      },
      orderBy: {
        transaction_date_time: "desc", // newest first
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
      orderBy: {
        transaction_date_time: "desc",
      },
    });
  }

  // New methods for organizer transaction management
  public static async getOrganizerTransactionsRepo(organizerId: number) {
    try {
      const organizerEvents = await prisma.event.findMany({
        where: { event_organizer_id: organizerId },
        select: { id: true },
      });

      const eventIds = organizerEvents.map((event) => event.id);
      if (eventIds.length === 0) return [];

      const eventTickets = await prisma.ticket.findMany({
        where: { event_id: { in: eventIds } },
        select: { id: true },
      });

      const ticketIds = eventTickets.map((ticket) => ticket.id);
      if (ticketIds.length === 0) return [];

      const transactions = await prisma.transactions.findMany({
        where: {
          tickets: {
            some: {
              ticket_id: { in: ticketIds },
            },
          },
        },
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
          coupon: true,
          voucher: true,
          point: true,
        },
        orderBy: {
          transaction_date_time: "desc",
        },
      });

      return transactions;
    } catch (error) {
      console.error("Error in getOrganizerTransactionsRepo:", error);
      throw error;
    }
  }

  public static async getOrganizerTransactionsSimpleRepo(organizerId: number) {
    try {
      const transactions = await prisma.$queryRaw`
        SELECT DISTINCT 
          t.id,
          t.user_id,
          t.coupon_id,
          t.voucher_id,
          t.point_id,
          t.status,
          t.points_used,
          t.discount_voucher,
          t.discount_coupon,
          t.total_price,
          t.transaction_date_time,
          t.transaction_expired,
          t.is_accepted,
          t.payment_proof_url,
          u.username,
          u.email,
          tt.qty,
          tt.subtotal_price,
          tk.ticket_type,
          tk.price,
          e.event_name,
          e.event_location
        FROM "Transactions" t
        JOIN "TransactionTicket" tt ON t.id = tt.transaction_id
        JOIN "Ticket" tk ON tt.ticket_id = tk.id
        JOIN "Event" e ON tk.event_id = e.id
        JOIN "User" u ON t.user_id = u.id
        WHERE e.event_organizer_id = ${organizerId}
        ORDER BY t.transaction_date_time DESC
      `;

      return transactions;
    } catch (error) {
      console.error("Error in getOrganizerTransactionsSimpleRepo:", error);
      throw error;
    }
  }

  public static async getOrganizerTransactionsByStatusRepo(
    organizerId: number,
    status: PaymentStatusType
  ) {
    return prisma.transactions.findMany({
      where: {
        status: status,
        tickets: {
          some: {
            ticket: {
              event: {
                event_organizer_id: organizerId,
              },
            },
          },
        },
      },
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
        coupon: true,
        voucher: true,
        point: true,
      },
      orderBy: {
        transaction_date_time: "desc",
      },
    });
  }

  public static async acceptTransactionRepo(
    transactionId: number,
    organizerId: number
  ) {
    const transaction = await prisma.transactions.findUnique({
      where: { id: transactionId },
      include: {
        tickets: {
          include: {
            ticket: {
              include: {
                event: true,
              },
            },
          },
        },
      },
    });

    if (!transaction) throw new Error("Transaction not found");

    const eventId = transaction.tickets[0]?.ticket.event_id;
    if (!eventId) throw new Error("Invalid transaction");

    const event = await prisma.event.findUnique({
      where: { id: eventId },
      include: { organizer: true },
    });

    if (!event || event.organizer.id !== organizerId) {
      throw new Error("Unauthorized: You don't own this event");
    }

    if (transaction.status !== PaymentStatusType.WAITING_CONFIRMATION) {
      throw new Error("Transaction is not waiting for confirmation");
    }

    return prisma.transactions.update({
      where: { id: transactionId },
      data: {
        status: PaymentStatusType.SUCCESS,
        is_accepted: true,
      },
    });
  }

  public static async rejectTransactionRepo(
    transactionId: number,
    organizerId: number,
    rejectionReason?: string
  ) {
    const transaction = await prisma.transactions.findUnique({
      where: { id: transactionId },
      include: {
        tickets: {
          include: {
            ticket: {
              include: {
                event: true,
              },
            },
          },
        },
        user: true,
        voucher: true,
        coupon: true,
        point: true,
      },
    });

    if (!transaction) throw new Error("Transaction not found");

    const eventId = transaction.tickets[0]?.ticket.event_id;
    if (!eventId) throw new Error("Invalid transaction");

    const event = await prisma.event.findUnique({
      where: { id: eventId },
      include: { organizer: true },
    });

    if (!event || event.organizer.id !== organizerId) {
      throw new Error("Unauthorized: You don't own this event");
    }

    if (transaction.status !== PaymentStatusType.WAITING_CONFIRMATION) {
      throw new Error("Transaction is not waiting for confirmation");
    }

    // Use transaction to ensure all operations succeed or fail together
    return await prisma.$transaction(async (tx) => {
      // 1. Update transaction status to rejected
      const updatedTransaction = await tx.transactions.update({
        where: { id: transactionId },
        data: {
          status: PaymentStatusType.REJECTED,
          is_accepted: false,
        },
      });

      // 2. Restore seats and ticket quantities
      for (const ticketTransaction of transaction.tickets) {
        const ticket = ticketTransaction.ticket;
        try {
          // Restore ticket available quantity
          await tx.ticket.update({
            where: { id: ticket.id },
            data: { available_qty: { increment: ticketTransaction.qty } },
          });

          // Restore event available seats
          await tx.event.update({
            where: { id: ticket.event_id },
            data: { available_seats: { increment: ticketTransaction.qty } },
          });
        } catch (seatError) {
          console.error(
            `Failed to restore seats for transaction ${transactionId}:`,
            seatError
          );
          // Don't fail the entire transaction if seat restoration fails
        }
      }

      // 3. Points and coupons are consumed and not restored on rejection
      // 4. Vouchers remain available for future use
      // (No restoration logic needed for points, coupons, or vouchers)

      return updatedTransaction;
    });
  }

  public static async getTransactionPaymentProofRepo(
    transactionId: number,
    organizerId: number
  ) {
    const transaction = await prisma.transactions.findUnique({
      where: { id: transactionId },
      include: {
        user: true,
        tickets: {
          include: {
            ticket: {
              include: {
                event: {
                  include: {
                    organizer: true,
                  },
                },
              },
            },
          },
        },
      },
    });

    if (!transaction) throw new Error("Transaction not found");

    const eventId = transaction.tickets[0]?.ticket.event_id;
    if (!eventId) throw new Error("Invalid transaction");

    const event = await prisma.event.findUnique({
      where: { id: eventId },
      include: { organizer: true },
    });

    if (!event || event.organizer.id !== organizerId) {
      throw new Error("Unauthorized: You don't own this event");
    }

    return transaction;
  }
}
