export interface TransactionEmailData {
  username: string;
  eventName: string;
  eventLocation: string;
  eventDate: string;
  transactionId: number;
  totalPrice: number;
  ticketDetails: {
    ticketType: string;
    quantity: number;
    price: number;
  }[];
  rejectionReason?: string | undefined;
  pointsUsed?: number | undefined;
  voucherUsed?:
    | {
        discountValue: number;
        voucherCode?: string;
      }
    | undefined;
  couponUsed?:
    | {
        discountValue: number;
        couponCode?: string;
      }
    | undefined;
}

export const createTransactionAcceptedEmail = (
  data: TransactionEmailData
): string => {
  const {
    username,
    eventName,
    eventLocation,
    eventDate,
    transactionId,
    totalPrice,
    ticketDetails,
  } = data;

  return `
    <!DOCTYPE html>
    <html>
    <head>
      <meta charset="utf-8">
      <meta name="viewport" content="width=device-width, initial-scale=1.0">
      <title>Transaction Accepted - TicketNest</title>
      <style>
        body {
          font-family: Arial, sans-serif;
          line-height: 1.6;
          color: #333;
          max-width: 600px;
          margin: 0 auto;
          padding: 20px;
        }
        .header {
          background-color: #4CAF50;
          color: white;
          padding: 20px;
          text-align: center;
          border-radius: 8px 8px 0 0;
        }
        .content {
          background-color: #f9f9f9;
          padding: 30px;
          border-radius: 0 0 8px 8px;
        }
        .success-icon {
          font-size: 48px;
          color: #4CAF50;
          text-align: center;
          margin-bottom: 20px;
        }
        .ticket-details {
          background-color: white;
          padding: 20px;
          border-radius: 8px;
          margin: 20px 0;
          border-left: 4px solid #4CAF50;
        }
        .ticket-item {
          display: flex;
          justify-content: space-between;
          padding: 10px 0;
          border-bottom: 1px solid #eee;
        }
        .ticket-item:last-child {
          border-bottom: none;
        }
        .total {
          font-weight: bold;
          font-size: 18px;
          color: #4CAF50;
          text-align: right;
          margin-top: 15px;
          padding-top: 15px;
          border-top: 2px solid #4CAF50;
        }
        .footer {
          text-align: center;
          margin-top: 30px;
          color: #666;
          font-size: 14px;
        }
        .highlight {
          background-color: #e8f5e8;
          padding: 15px;
          border-radius: 5px;
          margin: 20px 0;
        }
      </style>
    </head>
    <body>
      <div class="header">
        <h1>🎉 Transaction Accepted!</h1>
        <p>Your payment has been confirmed</p>
      </div>
      
      <div class="content">
        <div class="success-icon">✅</div>
        
        <p>Dear <strong>${username}</strong>,</p>
        
        <p>Great news! Your payment has been accepted and your tickets are now confirmed.</p>
        
        <div class="highlight">
          <h3>Event Details</h3>
          <p><strong>Event:</strong> ${eventName}</p>
          <p><strong>Location:</strong> ${eventLocation}</p>
          <p><strong>Date:</strong> ${eventDate}</p>
          <p><strong>Transaction ID:</strong> #${transactionId}</p>
        </div>
        
        <div class="ticket-details">
          <h3>Your Tickets</h3>
          ${ticketDetails
            .map(
              (ticket) => `
            <div class="ticket-item">
              <span>${ticket.ticketType} × ${ticket.quantity}</span>
              <span>Rp ${ticket.price.toLocaleString("id-ID")}</span>
            </div>
          `
            )
            .join("")}
          <div class="total">
            Total: Rp ${totalPrice.toLocaleString("id-ID")}
          </div>
        </div>
        
        <div class="highlight">
          <h3>What's Next?</h3>
          <p>• Your tickets are now confirmed and ready to use</p>
          <p>• You will receive your e-tickets closer to the event date</p>
          <p>• Please arrive at the venue 30 minutes before the event starts</p>
          <p>• Bring a valid ID for verification</p>
        </div>
        
        <p>Thank you for choosing TicketNest! We hope you enjoy the event.</p>
        
        <div class="footer">
          <p>If you have any questions, please contact our support team.</p>
          <p>© 2024 TicketNest. All rights reserved.</p>
        </div>
      </div>
    </body>
    </html>
  `;
};

export const createTransactionRejectedEmail = (
  data: TransactionEmailData
): string => {
  const {
    username,
    eventName,
    eventLocation,
    eventDate,
    transactionId,
    totalPrice,
    ticketDetails,
    rejectionReason,
    pointsUsed,
    voucherUsed,
    couponUsed,
  } = data;

  return `
    <!DOCTYPE html>
    <html>
    <head>
      <meta charset="utf-8">
      <meta name="viewport" content="width=device-width, initial-scale=1.0">
      <title>Transaction Rejected - TicketNest</title>
      <style>
        body {
          font-family: Arial, sans-serif;
          line-height: 1.6;
          color: #333;
          max-width: 600px;
          margin: 0 auto;
          padding: 20px;
        }
        .header {
          background-color: #f44336;
          color: white;
          padding: 20px;
          text-align: center;
          border-radius: 8px 8px 0 0;
        }
        .content {
          background-color: #f9f9f9;
          padding: 30px;
          border-radius: 0 0 8px 8px;
        }
        .reject-icon {
          font-size: 48px;
          color: #f44336;
          text-align: center;
          margin-bottom: 20px;
        }
        .ticket-details {
          background-color: white;
          padding: 20px;
          border-radius: 8px;
          margin: 20px 0;
          border-left: 4px solid #f44336;
        }
        .ticket-item {
          display: flex;
          justify-content: space-between;
          padding: 10px 0;
          border-bottom: 1px solid #eee;
        }
        .ticket-item:last-child {
          border-bottom: none;
        }
        .total {
          font-weight: bold;
          font-size: 18px;
          color: #f44336;
          text-align: right;
          margin-top: 15px;
          padding-top: 15px;
          border-top: 2px solid #f44336;
        }
        .footer {
          text-align: center;
          margin-top: 30px;
          color: #666;
          font-size: 14px;
        }
        .highlight {
          background-color: #ffeaea;
          padding: 15px;
          border-radius: 5px;
          margin: 20px 0;
        }
        .refund-info {
          background-color: #e8f5e8;
          padding: 15px;
          border-radius: 5px;
          margin: 20px 0;
          border-left: 4px solid #4CAF50;
        }
        .reason-box {
          background-color: #fff3cd;
          padding: 15px;
          border-radius: 5px;
          margin: 20px 0;
          border-left: 4px solid #ffc107;
        }
      </style>
    </head>
    <body>
      <div class="header">
        <h1>❌ Transaction Rejected</h1>
        <p>Your payment could not be processed</p>
      </div>
      
      <div class="content">
        <div class="reject-icon">⚠️</div>
        
        <p>Dear <strong>${username}</strong>,</p>
        
        <p>We regret to inform you that your payment has been rejected and your transaction has been cancelled.</p>
        
        ${
          rejectionReason
            ? `
          <div class="reason-box">
            <h3>Reason for Rejection</h3>
            <p>${rejectionReason}</p>
          </div>
        `
            : ""
        }
        
        <div class="highlight">
          <h3>Transaction Details</h3>
          <p><strong>Event:</strong> ${eventName}</p>
          <p><strong>Location:</strong> ${eventLocation}</p>
          <p><strong>Date:</strong> ${eventDate}</p>
          <p><strong>Transaction ID:</strong> #${transactionId}</p>
        </div>
        
        <div class="ticket-details">
          <h3>Requested Tickets</h3>
          ${ticketDetails
            .map(
              (ticket) => `
            <div class="ticket-item">
              <span>${ticket.ticketType} × ${ticket.quantity}</span>
              <span>Rp ${ticket.price.toLocaleString("id-ID")}</span>
            </div>
          `
            )
            .join("")}
          <div class="total">
            Total: Rp ${totalPrice.toLocaleString("id-ID")}
          </div>
        </div>
        
        <div class="refund-info">
          <h3>🔄 Refund Information</h3>
          <p>Your refund has been processed automatically:</p>
          <ul>
            <li>✅ Seats have been released and are now available for other customers</li>
            ${
              pointsUsed
                ? `<li>✅ ${pointsUsed} points have been restored to your account</li>`
                : ""
            }
                         ${
                           voucherUsed
                             ? `<li>✅ Voucher "${
                                 voucherUsed.voucherCode || "Your voucher"
                               }" has been restored</li>`
                             : ""
                         }
             ${
               couponUsed
                 ? `<li>✅ Coupon "${
                     couponUsed.couponCode || "Your coupon"
                   }" has been restored</li>`
                 : ""
             }
            <li>✅ Any payment made will be refunded to your original payment method within 3-5 business days</li>
          </ul>
        </div>
        
        <div class="highlight">
          <h3>What You Can Do</h3>
          <p>• Try booking again with a different payment method</p>
          <p>• Contact our support team if you need assistance</p>
          <p>• Check if there are alternative payment options available</p>
        </div>
        
        <p>We apologize for any inconvenience caused. Thank you for your understanding.</p>
        
        <div class="footer">
          <p>If you have any questions, please contact our support team.</p>
          <p>© 2024 TicketNest. All rights reserved.</p>
        </div>
      </div>
    </body>
    </html>
  `;
};
