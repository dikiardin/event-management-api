import cron from "node-cron";
import { TransactionService } from "../service/transaction.service";

export function startTransactionJob() {
  // auto check if in db has WAITING_PAYMENT every 1 minute, if user not upload the transaction until 2 hours, it will expired automatically
  cron.schedule("*/1 * * * *", async () => {
    console.log("[CRON] Checking expired transactions...");
    try {
      await TransactionService.autoExpireTransactionsService();
    } catch (err) {
      console.error("[CRON] Failed to auto-expire transactions:", err);
    }
  });

  // auto-cancel admin pending after 3 days (same logic as expired)
  cron.schedule("*/10 * * * *", async () => {
    console.log("[CRON] Checking for admin pending transactions...");
    try {
      await TransactionService.autoCancelAdminPendingService();
    } catch (err) {
      console.error("[CRON] Failed to auto-reject transactions:", err);
    }
  });
}
