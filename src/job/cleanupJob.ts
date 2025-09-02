import cron from "node-cron";
import { VoucherService } from "../service/voucher.service";
import { PointService } from "../service/point.service";

export function startCleanupJobs() {
  // Delete expired vouchers every hour
  cron.schedule("*/1 * * * *", async () => {
    console.log("[CRON] Checking for expired vouchers...");
    try {
      await VoucherService.deleteExpiredVouchersService();
    } catch (err) {
      console.error("[CRON] Failed to delete expired vouchers:", err);
    }
  });

  // Delete expired points every hour
  cron.schedule("*/1 * * * *", async () => {
    console.log("[CRON] Checking for expired points...");
    try {
      await PointService.deleteExpiredPointsService();
    } catch (err) {
      console.error("[CRON] Failed to delete expired points:", err);
    }
  });
}
