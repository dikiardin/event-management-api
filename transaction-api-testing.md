# Transaction Management API Testing Guide

## Setup Testing Environment

### 1. Prerequisites

- Backend server berjalan di `http://localhost:3000`
- Postman atau tools API testing lainnya
- Token JWT untuk organizer (dapatkan dari login organizer)

### 2. Get Organizer Token

Sebelum testing, Anda perlu login sebagai organizer untuk mendapatkan token:

```bash
POST http://localhost:3000/api/auth/login
Content-Type: application/json

{
  "email": "organizer@example.com",
  "password": "password123"
}
```

Simpan token dari response untuk digunakan di semua request berikutnya.

## Test Cases

### Test Case 1: Get All Organizer Transactions

**Request:**

```bash
GET http://localhost:3000/api/transactions/organizer
Authorization: Bearer <your_token_here>
```

**Expected Response:**

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

**Test Steps:**

1. Pastikan ada transaksi di database
2. Kirim request dengan token organizer yang valid
3. Verifikasi response berisi array transactions
4. Verifikasi setiap transaksi memiliki data user dan tickets

---

### Test Case 2: Get Transactions by Status

**Request:**

```bash
GET http://localhost:3000/api/transactions/organizer/status/WAITING_CONFIRMATION
Authorization: Bearer <your_token_here>
```

**Test Variations:**

- `WAITING_PAYMENT`
- `WAITING_CONFIRMATION`
- `SUCCESS`
- `REJECTED`
- `EXPIRED`
- `CANCELLED`

**Expected Response:**

```json
{
  "success": true,
  "transactions": [
    {
      "id": 1,
      "status": "WAITING_CONFIRMATION"
      // ... other fields
    }
  ]
}
```

**Test Steps:**

1. Test dengan status yang valid
2. Test dengan status yang tidak valid (harus return error)
3. Verifikasi hanya transaksi dengan status yang diminta yang dikembalikan

---

### Test Case 3: Accept Transaction

**Request:**

```bash
POST http://localhost:3000/api/transactions/organizer/accept/1
Authorization: Bearer <your_token_here>
Content-Type: application/json
```

**Expected Response:**

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

**Test Steps:**

1. Pastikan ada transaksi dengan status `WAITING_CONFIRMATION`
2. Kirim request accept
3. Verifikasi status berubah menjadi `SUCCESS`
4. Test dengan transaksi yang sudah SUCCESS (harus return error)
5. Test dengan transaksi yang tidak ada (harus return 404)

---

### Test Case 4: Reject Transaction

**Request:**

```bash
POST http://localhost:3000/api/transactions/organizer/reject/1
Authorization: Bearer <your_token_here>
Content-Type: application/json

{
  "rejection_reason": "Bukti pembayaran tidak jelas"
}
```

**Expected Response:**

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

**Test Steps:**

1. Pastikan ada transaksi dengan status `WAITING_CONFIRMATION`
2. Kirim request reject dengan alasan
3. Verifikasi status berubah menjadi `REJECTED`
4. Test tanpa rejection_reason (harus return error)
5. Test dengan transaksi yang sudah SUCCESS (harus return error)

---

### Test Case 5: Get Transaction Payment Proof

**Request:**

```bash
GET http://localhost:3000/api/transactions/organizer/proof/1
Authorization: Bearer <your_token_here>
```

**Expected Response:**

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
    ],
    "total_price": 150000
  }
}
```

**Test Steps:**

1. Pastikan ada transaksi dengan payment_proof_url
2. Kirim request untuk melihat bukti pembayaran
3. Verifikasi response berisi payment_proof_url
4. Test dengan transaksi yang tidak ada (harus return 404)

---

### Test Case 6: Get Organizer Transaction Statistics

**Request:**

```bash
GET http://localhost:3000/api/transactions/organizer/stats
Authorization: Bearer <your_token_here>
```

**Expected Response:**

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

**Test Steps:**

1. Kirim request untuk mendapatkan statistik
2. Verifikasi response berisi semua field statistik
3. Verifikasi total = sum dari semua status
4. Verifikasi total_revenue dan pending_revenue

---

## Error Testing

### Test Case 7: Unauthorized Access

**Request:**

```bash
GET http://localhost:3000/api/transactions/organizer
# Tanpa Authorization header
```

**Expected Response:**

```json
{
  "status": 401,
  "message": "Unauthorized"
}
```

### Test Case 8: Forbidden Access (Non-Organizer)

**Request:**

```bash
GET http://localhost:3000/api/transactions/organizer
Authorization: Bearer <user_token_not_organizer>
```

**Expected Response:**

```json
{
  "status": 403,
  "message": "Only organizer can access this endpoint"
}
```

### Test Case 9: Invalid Transaction ID

**Request:**

```bash
POST http://localhost:3000/api/transactions/organizer/accept/999999
Authorization: Bearer <your_token_here>
```

**Expected Response:**

```json
{
  "status": 404,
  "message": "Transaction not found"
}
```

### Test Case 10: Invalid Status for Accept/Reject

**Request:**

```bash
POST http://localhost:3000/api/transactions/organizer/accept/1
Authorization: Bearer <your_token_here>
# Untuk transaksi yang sudah SUCCESS
```

**Expected Response:**

```json
{
  "status": 400,
  "message": "Transaction is not waiting for confirmation"
}
```

## Postman Collection

Berikut adalah contoh Postman collection yang bisa Anda import:

```json
{
  "info": {
    "name": "Transaction Management API",
    "schema": "https://schema.getpostman.com/json/collection/v2.1.0/collection.json"
  },
  "variable": [
    {
      "key": "baseUrl",
      "value": "http://localhost:3000"
    },
    {
      "key": "organizerToken",
      "value": "your_token_here"
    }
  ],
  "item": [
    {
      "name": "Get All Transactions",
      "request": {
        "method": "GET",
        "header": [
          {
            "key": "Authorization",
            "value": "Bearer {{organizerToken}}"
          }
        ],
        "url": {
          "raw": "{{baseUrl}}/api/transactions/organizer"
        }
      }
    },
    {
      "name": "Get Transactions by Status",
      "request": {
        "method": "GET",
        "header": [
          {
            "key": "Authorization",
            "value": "Bearer {{organizerToken}}"
          }
        ],
        "url": {
          "raw": "{{baseUrl}}/api/transactions/organizer/status/WAITING_CONFIRMATION"
        }
      }
    },
    {
      "name": "Accept Transaction",
      "request": {
        "method": "POST",
        "header": [
          {
            "key": "Authorization",
            "value": "Bearer {{organizerToken}}"
          },
          {
            "key": "Content-Type",
            "value": "application/json"
          }
        ],
        "url": {
          "raw": "{{baseUrl}}/api/transactions/organizer/accept/1"
        }
      }
    },
    {
      "name": "Reject Transaction",
      "request": {
        "method": "POST",
        "header": [
          {
            "key": "Authorization",
            "value": "Bearer {{organizerToken}}"
          },
          {
            "key": "Content-Type",
            "value": "application/json"
          }
        ],
        "body": {
          "mode": "raw",
          "raw": "{\n  \"rejection_reason\": \"Bukti pembayaran tidak jelas\"\n}"
        },
        "url": {
          "raw": "{{baseUrl}}/api/transactions/organizer/reject/1"
        }
      }
    },
    {
      "name": "Get Payment Proof",
      "request": {
        "method": "GET",
        "header": [
          {
            "key": "Authorization",
            "value": "Bearer {{organizerToken}}"
          }
        ],
        "url": {
          "raw": "{{baseUrl}}/api/transactions/organizer/proof/1"
        }
      }
    },
    {
      "name": "Get Statistics",
      "request": {
        "method": "GET",
        "header": [
          {
            "key": "Authorization",
            "value": "Bearer {{organizerToken}}"
          }
        ],
        "url": {
          "raw": "{{baseUrl}}/api/transactions/organizer/stats"
        }
      }
    }
  ]
}
```

## Testing Checklist

- [ ] Backend server berjalan
- [ ] Database terisi dengan data transaksi
- [ ] Token organizer valid
- [ ] Test semua endpoint GET
- [ ] Test semua endpoint POST
- [ ] Test error cases
- [ ] Test authorization
- [ ] Test business rules
- [ ] Verifikasi response format
- [ ] Verifikasi status codes

## Tips Testing

1. **Gunakan Postman Environment** untuk menyimpan token dan base URL
2. **Test dengan data yang berbeda** untuk memastikan logika bekerja dengan benar
3. **Perhatikan status transaksi** sebelum melakukan accept/reject
4. **Test edge cases** seperti transaksi yang tidak ada atau status yang tidak valid
5. **Verifikasi database** setelah melakukan accept/reject untuk memastikan perubahan tersimpan
6. **Test dengan user yang bukan organizer** untuk memastikan authorization bekerja

## Troubleshooting

### Common Issues:

1. **401 Unauthorized**: Token tidak valid atau expired
2. **403 Forbidden**: User bukan organizer
3. **404 Not Found**: Transaction ID tidak ada
4. **400 Bad Request**: Status transaksi tidak sesuai untuk operasi yang diminta

### Solutions:

1. **Refresh token** dengan login ulang
2. **Pastikan user memiliki role ORGANIZER**
3. **Gunakan transaction ID yang valid**
4. **Periksa status transaksi** sebelum accept/reject
