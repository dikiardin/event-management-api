# Transaction Management API Documentation

## Overview

Transaction Management API memungkinkan organizer untuk mengelola transaksi pembayaran dari user, termasuk menerima, menolak, dan melihat bukti pembayaran.

## Base URL

```
/api/transactions
```

## Authentication

Semua endpoint memerlukan authentication token dan role ORGANIZER.

## Endpoints

### 1. Get All Organizer Transactions

**GET** `/organizer`

Mendapatkan semua transaksi untuk event yang dimiliki oleh organizer.

**Headers:**

```
Authorization: Bearer <token>
```

**Response:**

```json
{
  "success": true,
  "transactions": [
    {
      "id": 1,
      "user_id": 123,
      "status": "WAITING_CONFIRMATION",
      "total_price": 150000,
      "payment_proof_url": "https://example.com/proof.jpg",
      "transaction_date_time": "2024-01-15T10:30:00Z",
      "user": {
        "id": 123,
        "username": "john_doe",
        "email": "john@example.com"
      },
      "tickets": [
        {
          "qty": 2,
          "subtotal_price": 150000,
          "ticket": {
            "ticket_type": "REGULAR",
            "price": 75000,
            "event": {
              "event_name": "Music Festival 2024",
              "event_location": "Jakarta Convention Center"
            }
          }
        }
      ]
    }
  ]
}
```

### 2. Get Transactions by Status

**GET** `/organizer/status/:status`

Mendapatkan transaksi berdasarkan status pembayaran.

**Parameters:**

- `status`: Status pembayaran (WAITING_PAYMENT, WAITING_CONFIRMATION, SUCCESS, REJECTED, EXPIRED, CANCELLED)

**Response:** Sama seperti endpoint sebelumnya, tetapi hanya transaksi dengan status tertentu.

### 3. Accept Transaction

**POST** `/organizer/accept/:id`

Menerima transaksi dan mengubah status menjadi SUCCESS.

**Parameters:**

- `id`: ID transaksi

**Response:**

```json
{
  "success": true,
  "message": "Transaction accepted successfully",
  "transaction": {
    "id": 1,
    "status": "SUCCESS",
    "is_accepted": true
  }
}
```

### 4. Reject Transaction

**POST** `/organizer/reject/:id`

Menolak transaksi dan mengubah status menjadi REJECTED.

**Parameters:**

- `id`: ID transaksi

**Body:**

```json
{
  "rejection_reason": "Bukti pembayaran tidak jelas"
}
```

**Response:**

```json
{
  "success": true,
  "message": "Transaction rejected successfully",
  "transaction": {
    "id": 1,
    "status": "REJECTED",
    "is_accepted": false
  }
}
```

### 5. Get Transaction Payment Proof

**GET** `/organizer/proof/:id`

Melihat bukti pembayaran untuk transaksi tertentu.

**Parameters:**

- `id`: ID transaksi

**Response:**

```json
{
  "success": true,
  "transaction": {
    "id": 1,
    "payment_proof_url": "https://example.com/proof.jpg",
    "user": {
      "username": "john_doe",
      "email": "john@example.com"
    },
    "tickets": [...],
    "total_price": 150000
  }
}
```

### 6. Get Organizer Transaction Statistics

**GET** `/organizer/stats`

Mendapatkan statistik transaksi untuk dashboard organizer.

**Response:**

```json
{
  "success": true,
  "stats": {
    "total": 50,
    "waiting_confirmation": 5,
    "success": 40,
    "rejected": 3,
    "expired": 1,
    "cancelled": 1,
    "total_revenue": 7500000,
    "pending_revenue": 375000
  }
}
```

## Error Responses

### Unauthorized

```json
{
  "status": 401,
  "message": "Unauthorized"
}
```

### Forbidden

```json
{
  "status": 403,
  "message": "Only organizer can access this endpoint"
}
```

### Not Found

```json
{
  "status": 404,
  "message": "Transaction not found"
}
```

### Bad Request

```json
{
  "status": 400,
  "message": "Transaction is not waiting for confirmation"
}
```

## Business Rules

1. **Authorization**: Hanya organizer yang bisa mengakses endpoint ini
2. **Ownership**: Organizer hanya bisa mengelola transaksi untuk event yang mereka buat
3. **Status Validation**:
   - Hanya transaksi dengan status `WAITING_CONFIRMATION` yang bisa di-accept/reject
   - Transaksi yang sudah `SUCCESS`, `REJECTED`, `EXPIRED`, atau `CANCELLED` tidak bisa diubah
4. **Audit Trail**: Semua aksi accept/reject akan di-log untuk audit purposes

## Usage Examples

### Frontend Integration

```javascript
// Get all transactions
const getTransactions = async () => {
  const response = await fetch("/api/transactions/organizer", {
    headers: {
      Authorization: `Bearer ${token}`,
    },
  });
  const data = await response.json();
  return data.transactions;
};

// Accept transaction
const acceptTransaction = async (transactionId) => {
  const response = await fetch(
    `/api/transactions/organizer/accept/${transactionId}`,
    {
      method: "POST",
      headers: {
        Authorization: `Bearer ${token}`,
        "Content-Type": "application/json",
      },
    }
  );
  return response.json();
};

// Reject transaction
const rejectTransaction = async (transactionId, reason) => {
  const response = await fetch(
    `/api/transactions/organizer/reject/${transactionId}`,
    {
      method: "POST",
      headers: {
        Authorization: `Bearer ${token}`,
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ rejection_reason: reason }),
    }
  );
  return response.json();
};
```

## Notes

- Semua endpoint memerlukan validasi token JWT
- Role verification dilakukan di middleware level
- Transaksi yang di-reject akan mengembalikan seat ke event
- Statistik real-time untuk dashboard organizer
- Logging untuk audit trail dan monitoring
