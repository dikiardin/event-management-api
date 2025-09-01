# Thunder Client Testing untuk Event Management API

## Setup Thunder Client

### 1. Environment Variables

Buat environment baru di Thunder Client dengan nama "Event API Testing" dan set variables berikut:

```
baseUrl: http://localhost:3000
organizerToken: (akan diisi setelah login)
userToken: (untuk testing user biasa)
```

## Test Cases untuk Thunder Client

### Test Case 1: Login Organizer

**Method:** POST  
**URL:** `{{baseUrl}}/api/auth/login`  
**Headers:**

```
Content-Type: application/json
```

**Body (JSON):**

```json
{
  "email": "organizer@example.com",
  "password": "password123"
}
```

**Expected Response:**

```json
{
  "success": true,
  "token": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...",
  "user": {
    "id": 1,
    "username": "organizer",
    "email": "organizer@example.com",
    "role": "ORGANIZER"
  }
}
```

**Action:** Copy token dari response dan paste ke variable `organizerToken`

---

### Test Case 2: Get All Events (Public)

**Method:** GET  
**URL:** `{{baseUrl}}/api/events`  
**Headers:** (kosong - public endpoint)

**Expected Response:**

```json
{
  "success": true,
  "message": "Events retrieved successfully",
  "data": [
    {
      "id": 1,
      "event_name": "Music Festival 2024",
      "event_description": "Festival musik terbesar di Indonesia",
      "event_location": "Jakarta Convention Center",
      "event_date": "2024-02-15T18:00:00.000Z",
      "event_thumbnail": "https://res.cloudinary.com/example/image/upload/v123/festival.jpg",
      "category": "MUSIC",
      "organizer_id": 1,
      "organizer": {
        "username": "organizer",
        "email": "organizer@example.com"
      },
      "tickets": [
        {
          "id": 1,
          "ticket_type": "REGULAR",
          "price": 75000,
          "stock": 100
        },
        {
          "id": 2,
          "ticket_type": "VIP",
          "price": 150000,
          "stock": 50
        }
      ]
    }
  ]
}
```

---

### Test Case 3: Get Events by Category

**Method:** GET  
**URL:** `{{baseUrl}}/api/events?category=MUSIC`  
**Headers:** (kosong - public endpoint)

**Test Variations:**

- `MUSIC`
- `SPORTS`
- `THEATER`
- `FESTIVAL`

**Expected Response:**

```json
{
  "success": true,
  "message": "Events retrieved successfully",
  "data": [
    {
      "id": 1,
      "event_name": "Music Festival 2024",
      "category": "MUSIC",
      "event_date": "2024-02-15T18:00:00.000Z",
      "event_location": "Jakarta Convention Center"
    }
  ]
}
```

---

### Test Case 4: Get Event Detail by Title

**Method:** GET  
**URL:** `{{baseUrl}}/api/events/detail/Music Festival 2024`  
**Headers:** (kosong - public endpoint)

**Expected Response:**

```json
{
  "success": true,
  "message": "Event retrieved successfully",
  "data": {
    "id": 1,
    "event_name": "Music Festival 2024",
    "event_description": "Festival musik terbesar di Indonesia",
    "event_location": "Jakarta Convention Center",
    "event_date": "2024-02-15T18:00:00.000Z",
    "event_thumbnail": "https://res.cloudinary.com/example/image/upload/v123/festival.jpg",
    "category": "MUSIC",
    "organizer": {
      "username": "organizer",
      "email": "organizer@example.com"
    },
    "tickets": [
      {
        "id": 1,
        "ticket_type": "REGULAR",
        "price": 75000,
        "stock": 100
      },
      {
        "id": 2,
        "ticket_type": "VIP",
        "price": 150000,
        "stock": 50
      }
    ]
  }
}
```

---

### Test Case 5: Get Events by Organizer (Dashboard)

**Method:** GET  
**URL:** `{{baseUrl}}/api/events/organizer`  
**Headers:**

```
Authorization: Bearer {{organizerToken}}
```

**Expected Response:**

```json
{
  "success": true,
  "message": "Organizer events retrieved successfully",
  "data": [
    {
      "id": 1,
      "event_name": "Music Festival 2024",
      "event_description": "Festival musik terbesar di Indonesia",
      "event_location": "Jakarta Convention Center",
      "event_date": "2024-02-15T18:00:00.000Z",
      "event_thumbnail": "https://res.cloudinary.com/example/image/upload/v123/festival.jpg",
      "category": "MUSIC",
      "tickets": [
        {
          "id": 1,
          "ticket_type": "REGULAR",
          "price": 75000,
          "stock": 100,
          "sold": 25
        }
      ]
    }
  ]
}
```

---

### Test Case 6: Get Organizer Statistics

**Method:** GET  
**URL:** `{{baseUrl}}/api/events/organizer/stats`  
**Headers:**

```
Authorization: Bearer {{organizerToken}}
```

**Expected Response:**

```json
{
  "success": true,
  "message": "Organizer statistics retrieved successfully",
  "data": {
    "total_events": 5,
    "total_tickets_sold": 150,
    "total_revenue": 11250000,
    "events_by_category": {
      "MUSIC": 2,
      "SPORTS": 1,
      "THEATER": 1,
      "FESTIVAL": 1
    }
  }
}
```

---

### Test Case 7: Get Organizer Transactions

**Method:** GET  
**URL:** `{{baseUrl}}/api/events/organizer/transactions`  
**Headers:**

```
Authorization: Bearer {{organizerToken}}
```

**Expected Response:**

```json
{
  "success": true,
  "message": "Organizer transactions retrieved successfully",
  "data": [
    {
      "id": 1,
      "user_id": 123,
      "status": "SUCCESS",
      "total_price": 150000,
      "transaction_date_time": "2024-01-15T10:30:00Z",
      "user": {
        "username": "john_doe",
        "email": "john@example.com"
      },
      "tickets": [
        {
          "qty": 2,
          "ticket": {
            "ticket_type": "REGULAR",
            "price": 75000,
            "event": {
              "event_name": "Music Festival 2024"
            }
          }
        }
      ]
    }
  ]
}
```

---

### Test Case 8: Create Event (Organizer Only)

**Method:** POST  
**URL:** `{{baseUrl}}/api/events/create`  
**Headers:**

```
Authorization: Bearer {{organizerToken}}
Content-Type: multipart/form-data
```

**Body (Form Data):**

```
event_name: "Rock Concert 2024"
event_description: "Konser rock terbaik tahun ini"
event_location: "Gelora Bung Karno"
event_date: "2024-03-20T19:00:00.000Z"
category: "MUSIC"
tickets: [{"ticket_type":"REGULAR","price":100000,"stock":200},{"ticket_type":"VIP","price":250000,"stock":50}]
event_thumbnail: [file upload]
```

**Expected Response:**

```json
{
  "success": true,
  "message": "Event created successfully",
  "data": {
    "id": 2,
    "event_name": "Rock Concert 2024",
    "event_description": "Konser rock terbaik tahun ini",
    "event_location": "Gelora Bung Karno",
    "event_date": "2024-03-20T19:00:00.000Z",
    "event_thumbnail": "https://res.cloudinary.com/example/image/upload/v123/rock-concert.jpg",
    "category": "MUSIC",
    "organizer_id": 1,
    "tickets": [
      {
        "id": 3,
        "ticket_type": "REGULAR",
        "price": 100000,
        "stock": 200
      },
      {
        "id": 4,
        "ticket_type": "VIP",
        "price": 250000,
        "stock": 50
      }
    ]
  }
}
```

---

### Test Case 9: Update Event

**Method:** PATCH  
**URL:** `{{baseUrl}}/api/events/edit/1`  
**Headers:**

```
Authorization: Bearer {{organizerToken}}
Content-Type: application/json
```

**Body (JSON):**

```json
{
  "event_name": "Music Festival 2024 Updated",
  "event_description": "Festival musik terbesar di Indonesia - Updated",
  "event_date": "2024-02-20T18:00:00.000Z"
}
```

**Expected Response:**

```json
{
  "success": true,
  "message": "Event updated successfully",
  "data": {
    "id": 1,
    "event_name": "Music Festival 2024 Updated",
    "event_description": "Festival musik terbesar di Indonesia - Updated",
    "event_date": "2024-02-20T18:00:00.000Z",
    "event_location": "Jakarta Convention Center",
    "category": "MUSIC"
  }
}
```

---

### Test Case 10: Delete Event

**Method:** DELETE  
**URL:** `{{baseUrl}}/api/events/delete/1`  
**Headers:**

```
Authorization: Bearer {{organizerToken}}
```

**Expected Response:**

```json
{
  "success": true,
  "message": "Event deleted successfully"
}
```

---

## Error Testing di Thunder Client

### Test Case 11: Unauthorized Access

**Method:** GET  
**URL:** `{{baseUrl}}/api/events/organizer`  
**Headers:** (kosong)

**Expected Response:**

```json
{
  "status": 401,
  "message": "Unauthorized"
}
```

### Test Case 12: Forbidden Access (Non-Organizer)

**Method:** POST  
**URL:** `{{baseUrl}}/api/events/create`  
**Headers:**

```
Authorization: Bearer {{userToken}}
Content-Type: multipart/form-data
```

**Expected Response:**

```json
{
  "status": 403,
  "message": "Only organizer can access this endpoint"
}
```

### Test Case 13: Invalid Event ID

**Method:** PATCH  
**URL:** `{{baseUrl}}/api/events/edit/999999`  
**Headers:**

```
Authorization: Bearer {{organizerToken}}
Content-Type: application/json
```

**Expected Response:**

```json
{
  "status": 404,
  "message": "Event not found"
}
```

### Test Case 14: Invalid Event Title

**Method:** GET  
**URL:** `{{baseUrl}}/api/events/detail/`  
**Headers:** (kosong)

**Expected Response:**

```json
{
  "status": 400,
  "message": "Invalid title"
}
```

---

## Langkah-langkah Testing di Thunder Client

### 1. Setup Environment

1. Buka Thunder Client di VS Code
2. Klik "Environment" di sidebar
3. Buat environment baru: "Event API Testing"
4. Set variables:
   - `baseUrl`: `http://localhost:3000`
   - `organizerToken`: (kosong dulu)
   - `userToken`: (kosong dulu)

### 2. Login untuk Mendapatkan Token

1. Buat request baru untuk login organizer
2. Copy token dari response
3. Paste ke variable `organizerToken` di environment
4. Login sebagai user biasa untuk mendapatkan `userToken`

### 3. Test Public Endpoints

1. Test Case 2-4 (Get All Events, Get by Category, Get Detail)
2. Tidak memerlukan authentication

### 4. Test Organizer Endpoints

1. Test Case 5-7 (Dashboard, Stats, Transactions)
2. Memerlukan organizer token

### 5. Test CRUD Operations

1. Test Case 8 (Create Event)
2. Test Case 9 (Update Event)
3. Test Case 10 (Delete Event)

### 6. Test Error Cases

1. Test Case 11-14 untuk memastikan error handling bekerja

---

## Tips Thunder Client untuk Event Management

### 1. File Upload Testing

- Gunakan "Form Data" untuk upload file
- Pastikan field `event_thumbnail` berisi file gambar
- Test dengan berbagai format: JPG, PNG, GIF

### 2. JSON Array Testing

- Field `tickets` harus dalam format JSON string
- Contoh: `[{"ticket_type":"REGULAR","price":100000,"stock":200}]`

### 3. Date Format

- Gunakan ISO 8601 format untuk `event_date`
- Contoh: `2024-02-15T18:00:00.000Z`

### 4. Category Validation

- Valid categories: `MUSIC`, `SPORTS`, `THEATER`, `FESTIVAL`
- Test dengan invalid category untuk error handling

---

## Expected Status Codes

| Test Case        | Expected Status | Description                   |
| ---------------- | --------------- | ----------------------------- |
| Get All Events   | 200             | Events berhasil diambil       |
| Get Event Detail | 200             | Event detail berhasil diambil |
| Create Event     | 201             | Event berhasil dibuat         |
| Update Event     | 200             | Event berhasil diupdate       |
| Delete Event     | 200             | Event berhasil dihapus        |
| Unauthorized     | 401             | Token tidak valid             |
| Forbidden        | 403             | User bukan organizer          |
| Not Found        | 404             | Event tidak ditemukan         |
| Bad Request      | 400             | Invalid data                  |

---

## Troubleshooting

### File Upload Issues

- Pastikan file tidak terlalu besar (max 5MB)
- Gunakan format gambar yang didukung
- Check Cloudinary configuration

### JSON Parsing Issues

- Pastikan `tickets` field dalam format JSON string yang valid
- Escape karakter khusus dalam JSON

### Date Issues

- Gunakan timezone yang benar
- Pastikan format ISO 8601

### Database Issues

- Pastikan database terisi dengan data event
- Check foreign key constraints
