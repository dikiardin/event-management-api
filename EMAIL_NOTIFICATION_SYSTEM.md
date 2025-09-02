# Email Notification System for Transaction Management

## Overview

This system implements automatic email notifications for customers when their transactions are accepted or rejected by event organizers. The system ensures that all used points, vouchers, and coupons are properly restored when transactions are rejected, and available seats are returned to the inventory.

## Features Implemented

### ✅ Email Notifications

- **Transaction Accepted**: Customers receive confirmation emails when their payment is accepted
- **Transaction Rejected**: Customers receive rejection emails with refund information
- **Rich HTML Templates**: Professional, responsive email templates with event details
- **Comprehensive Information**: Includes transaction details, ticket information, and refund status

### ✅ Automatic Restoration

- **Seat Restoration**: Available seats are automatically restored when transactions are rejected
- **Point Restoration**: Used points are returned to customer accounts with 90-day expiration
- **Voucher Restoration**: Used vouchers are recreated and made available again
- **Coupon Restoration**: Used coupons are recreated with new expiration dates

### ✅ Error Handling

- **Graceful Email Failures**: Transaction processing continues even if email sending fails
- **Database Transactions**: All restoration operations are wrapped in database transactions
- **Comprehensive Logging**: All operations are logged for audit purposes

## File Structure

```
src/
├── utils/
│   ├── emailTemplates.ts          # HTML email templates
│   └── emailTest.ts              # Test script for email functionality
├── service/
│   ├── email.service.ts          # Email sending service
│   └── transaction.service.ts    # Updated with email integration
└── repositories/
    └── transaction.repository.ts  # Updated with restoration logic
```

## Email Templates

### Transaction Accepted Email

- **Subject**: `✅ Payment Confirmed - [Event Name] | TicketNest`
- **Content**:
  - Event details (name, location, date)
  - Transaction ID and total price
  - Ticket details with quantities and prices
  - Next steps for the customer
  - Professional styling with success indicators

### Transaction Rejected Email

- **Subject**: `❌ Payment Rejected - [Event Name] | TicketNest`
- **Content**:
  - Rejection reason (if provided)
  - Event and transaction details
  - Refund information
  - List of restored items (points, vouchers, coupons)
  - Alternative actions for the customer

## API Integration

### Transaction Acceptance

When an organizer accepts a transaction via:

```
POST /api/transactions/organizer/accept/:id
```

The system automatically:

1. Updates transaction status to `SUCCESS`
2. Sends acceptance email to customer
3. Logs the acceptance for audit

### Transaction Rejection

When an organizer rejects a transaction via:

```
POST /api/transactions/organizer/reject/:id
```

The system automatically:

1. Updates transaction status to `REJECTED`
2. Restores all used resources (seats, points, vouchers, coupons)
3. Sends rejection email to customer
4. Logs the rejection for audit

## Database Operations

### Restoration Process (for rejected transactions)

All restoration operations are wrapped in a database transaction to ensure data consistency:

1. **Update Transaction Status**: Mark as rejected
2. **Restore Seats**: Increment available seats for event and ticket quantities
3. **Restore Points**: Create new point record with 90-day expiration
4. **Restore Voucher**: Recreate voucher with reset usage count
5. **Restore Coupon**: Recreate coupon with new creation date

### Point Restoration Details

- **Expiration**: 90 days from rejection date
- **Source**: Marked as "TRANSACTION_REFUND"
- **Amount**: Exact amount that was used in the transaction

### Voucher Restoration Details

- **Usage Count**: Reset to 0
- **All Other Fields**: Preserved from original voucher
- **User Assignment**: Maintained for the same user

### Coupon Restoration Details

- **Creation Date**: Set to current date (extends validity)
- **All Other Fields**: Preserved from original coupon
- **User Assignment**: Maintained for the same user

## Configuration

### Environment Variables

Ensure these are set in your `.env` file:

```env
MAIL_SENDER=your-email@gmail.com
MAIL_PASSWORD=your-app-password
TEST_EMAIL=test@example.com  # Optional, for testing
```

### Email Service Configuration

The system uses Gmail SMTP through nodemailer:

- **Service**: Gmail
- **Authentication**: App password (not regular password)
- **Security**: TLS encryption

## Testing

### Manual Testing

Use the provided test script:

```bash
npx ts-node src/utils/emailTest.ts
```

### API Testing

Test the complete flow:

1. **Create a transaction** with points/vouchers/coupons
2. **Upload payment proof** to set status to `WAITING_CONFIRMATION`
3. **Accept the transaction** as an organizer
4. **Check email** for acceptance notification
5. **Create another transaction** and **reject it**
6. **Check email** for rejection notification
7. **Verify restoration** of points/vouchers/coupons in database

## Error Handling

### Email Failures

- Email sending errors are logged but don't affect transaction processing
- Transaction acceptance/rejection continues even if email fails
- Failed email attempts are logged with detailed error information

### Database Failures

- All restoration operations use database transactions
- If any restoration step fails, the entire operation is rolled back
- Transaction status remains unchanged if restoration fails

### Validation

- All operations validate transaction ownership
- Organizer authorization is checked before processing
- Transaction status is validated before processing

## Monitoring and Logging

### Console Logs

The system provides comprehensive logging:

- Transaction acceptance/rejection events
- Email sending attempts and results
- Database operation results
- Error details for troubleshooting

### Audit Trail

All operations are logged with:

- Timestamp
- User/Organizer ID
- Transaction ID
- Action performed
- Success/failure status

## Future Enhancements

### Potential Improvements

1. **Email Queue**: Implement email queue for better reliability
2. **Email Templates**: Add more template variations
3. **SMS Notifications**: Add SMS notifications as backup
4. **Email Preferences**: Allow users to configure notification preferences
5. **Bulk Operations**: Support bulk transaction processing
6. **Email Analytics**: Track email open rates and engagement

### Performance Considerations

1. **Async Processing**: Consider moving email sending to background jobs
2. **Template Caching**: Cache compiled email templates
3. **Database Optimization**: Optimize queries for large transaction volumes
4. **Rate Limiting**: Implement rate limiting for email sending

## Security Considerations

### Data Protection

- Email addresses are handled securely
- Transaction details in emails are sanitized
- No sensitive payment information in emails

### Access Control

- Only authorized organizers can accept/reject transactions
- Transaction ownership is validated
- Email sending is restricted to system operations

## Troubleshooting

### Common Issues

1. **Emails not sending**

   - Check Gmail app password configuration
   - Verify SMTP settings
   - Check network connectivity

2. **Restoration not working**

   - Check database transaction logs
   - Verify Prisma connection
   - Check for constraint violations

3. **Template rendering errors**
   - Validate email template data
   - Check for missing required fields
   - Verify HTML syntax

### Debug Mode

Enable detailed logging by setting:

```env
DEBUG=email:*
```

## Support

For issues or questions regarding the email notification system:

1. Check the console logs for error details
2. Verify environment configuration
3. Test with the provided test script
4. Review database transaction logs
