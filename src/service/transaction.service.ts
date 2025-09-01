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
    voucherId?: number
  ) {
    // expired in 3h
    const transaction_expired = new Date();
    transaction_expired.setHours(transaction_expired.getHours() + 3);

    return TransactionRepository.createTransactionRepo(
      userId,
      tickets,
      transaction_expired,
      couponId,
      voucherId
    );
  }

  // get transaction by id
  public static async getTransactionByIdService(id: number) {
    return TransactionRepository.getTransactionByIdRepo(id);
  }

  // get user transaction
  public static async getUserTransactionService(userId: number) {
    return TransactionRepository.getUserTransactionRepo(userId);
  }

  // cancel transaction
  public static async cancelTransactionService(
    transactionId: number,
    userId: number
  ) {
    return TransactionRepository.cancelTransactionRepo(transactionId, userId);
  }

  // upload payment proof
  public static async uploadPaymentProofService(
    transactionId: number,
    file: Express.Multer.File
  ) {
    const imageUrl = await cloudinaryUpload(file);
    return TransactionRepository.uploadPaymentProofRepo(
      transactionId,
      imageUrl
    );
  }

  // get all transactions by eventId
  public static async getTransactionsByEventIdService(eventId: number) {
    return TransactionRepository.getTransactionsByEventIdRepo(eventId);
  }

  // Organizer: get all transactions
  public static async getOrganizerTransactionsService(organizerId: number) {
    return TransactionRepository.getOrganizerTransactionsRepo(organizerId);
  }

  // Organizer: get simplified transaction list
  public static async getOrganizerTransactionsSimpleService(
    organizerId: number
  ) {
    return TransactionRepository.getOrganizerTransactionsSimpleRepo(
      organizerId
    );
  }

  // Organizer: get transactions by status
  public static async getOrganizerTransactionsByStatusService(
    organizerId: number,
    status: string
  ) {
    const validStatuses = Object.values($Enums.PaymentStatusType);
    if (!validStatuses.includes(status as $Enums.PaymentStatusType)) {
      throw new Error("Invalid payment status");
    }

    return TransactionRepository.getOrganizerTransactionsByStatusRepo(
      organizerId,
      status as $Enums.PaymentStatusType
    );
  }

  // Organizer: accept transaction
  public static async acceptTransactionService(
    transactionId: number,
    organizerId: number
  ) {
    const transaction = await TransactionRepository.acceptTransactionRepo(
      transactionId,
      organizerId
    );
    console.log(
      `Transaction ${transactionId} accepted by organizer ${organizerId}`
    );
    return transaction;
  }

  // Organizer: reject transaction
  public static async rejectTransactionService(
    transactionId: number,
    organizerId: number,
    rejectionReason?: string
  ) {
    const transaction = await TransactionRepository.rejectTransactionRepo(
      transactionId,
      organizerId,
      rejectionReason
    );
    console.log(
      `Transaction ${transactionId} rejected by organizer ${organizerId}. Reason: ${
        rejectionReason || "No reason provided"
      }`
    );
    return transaction;
  }

  // Organizer: get payment proof
  public static async getTransactionPaymentProofService(
    transactionId: number,
    organizerId: number
  ) {
    return TransactionRepository.getTransactionPaymentProofRepo(
      transactionId,
      organizerId
    );
  }

  // Organizer: get transaction statistics
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

    return stats;
  }
}
