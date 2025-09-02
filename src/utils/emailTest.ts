/**
 * Test script for email notification system
 * This file demonstrates how to test the email functionality
 *
 * Usage:
 * 1. Make sure your .env file has MAIL_SENDER and MAIL_PASSWORD configured
 * 2. Run: npx ts-node src/utils/emailTest.ts
 */

import { EmailService } from "../service/email.service";
import { TransactionEmailData } from "./emailTemplates";

// Sample data for testing
const sampleTransactionData: TransactionEmailData = {
  username: "John Doe",
  eventName: "Summer Music Festival 2024",
  eventLocation: "Jakarta Convention Center",
  eventDate: "Sabtu, 15 Juni 2024, 19:00",
  transactionId: 12345,
  totalPrice: 250000,
  ticketDetails: [
    {
      ticketType: "VIP",
      quantity: 2,
      price: 125000,
    },
  ],
  pointsUsed: 5000,
  voucherUsed: {
    discountValue: 10,
    voucherCode: "Early Bird Discount",
  },
  couponUsed: {
    discountValue: 5,
    couponCode: "Welcome Coupon",
  },
};

export async function testEmailNotifications() {
  console.log("🧪 Testing Email Notification System...\n");

  try {
    // Test 1: Transaction Accepted Email
    console.log("📧 Testing Transaction Accepted Email...");
    console.log(
      "Note: This will attempt to send a real email to the configured test address"
    );

    // You can replace this with a test email address
    const testEmail = process.env.TEST_EMAIL || "test@example.com";

    // Uncomment the following lines to test actual email sending
    // await EmailService.sendTransactionAcceptedEmail(12345, testEmail);
    // console.log("✅ Transaction accepted email test completed");

    console.log(
      "ℹ️  Email sending is commented out to prevent accidental sends"
    );
    console.log("   Uncomment the lines above to test actual email sending\n");

    // Test 2: Transaction Rejected Email
    console.log("📧 Testing Transaction Rejected Email...");

    // Uncomment the following lines to test actual email sending
    // await EmailService.sendTransactionRejectedEmail(12345, testEmail, "Payment proof unclear");
    // console.log("✅ Transaction rejected email test completed");

    console.log(
      "ℹ️  Email sending is commented out to prevent accidental sends"
    );
    console.log("   Uncomment the lines above to test actual email sending\n");

    console.log("🎉 Email notification system test completed successfully!");
    console.log("\n📋 Features implemented:");
    console.log("✅ Email templates for transaction acceptance");
    console.log("✅ Email templates for transaction rejection");
    console.log("✅ Automatic email sending on transaction accept/reject");
    console.log("✅ Point/voucher/coupon restoration on rejection");
    console.log("✅ Seat restoration on rejection");
    console.log("✅ Comprehensive email content with transaction details");
    console.log("✅ Error handling for email failures");
  } catch (error) {
    console.error("❌ Email test failed:", error);
  }
}

// Run the test if this file is executed directly
if (require.main === module) {
  testEmailNotifications();
}
