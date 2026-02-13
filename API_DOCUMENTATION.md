# API Documentation

## Authentication

All protected endpoints require a JWT token in the Authorization header:
```
Authorization: Bearer <token>
```

### Register
**POST** `/api/auth/register`

Creates a new user account.

**Request Body:**
```json
{
  "email": "user@example.com",
  "password": "SecurePass123",
  "name": "John Doe",
  "denomination": "catholic"
}
```

**Password Requirements:**
- Minimum 8 characters
- At least one uppercase letter
- At least one lowercase letter
- At least one number

**Response (201):**
```json
{
  "token": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...",
  "user": {
    "id": "507f1f77bcf86cd799439011",
    "email": "user@example.com",
    "name": "John Doe",
    "denomination": "catholic"
  }
}
```

### Login
**POST** `/api/auth/login`

Authenticates a user and returns a JWT token.

**Request Body:**
```json
{
  "email": "user@example.com",
  "password": "SecurePass123"
}
```

**Response (200):**
```json
{
  "token": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...",
  "user": {
    "id": "507f1f77bcf86cd799439011",
    "email": "user@example.com",
    "name": "John Doe",
    "denomination": "catholic"
  }
}
```

---

## User Endpoints

### Get Profile
**GET** `/api/user/profile` 🔒

Returns the authenticated user's profile.

**Response (200):**
```json
{
  "id": "507f1f77bcf86cd799439011",
  "email": "user@example.com",
  "name": "John Doe",
  "denomination": "catholic",
  "preferences": {
    "theme": "auto",
    "bibleTranslation": "KJV",
    "notificationsEnabled": true
  },
  "bookmarks": [],
  "readingHistory": [],
  "createdAt": "2024-01-01T00:00:00.000Z"
}
```

### Update Preferences
**PUT** `/api/user/preferences` 🔒

Updates user preferences.

**Request Body:**
```json
{
  "theme": "dark",
  "bibleTranslation": "NIV",
  "notificationsEnabled": true
}
```

**Valid Values:**
- `theme`: "light", "dark", "auto"
- `bibleTranslation`: Any string (e.g., "KJV", "NIV", "ESV")
- `notificationsEnabled`: boolean

### Add Bookmark
**POST** `/api/user/bookmarks` 🔒

Saves a Bible verse as a bookmark.

**Request Body:**
```json
{
  "book": "John",
  "chapter": 3,
  "verse": 16,
  "text": "For God so loved the world..."
}
```

### Delete Bookmark
**DELETE** `/api/user/bookmarks/:bookmarkId` 🔒

Removes a bookmark.

### Add to Reading History
**POST** `/api/user/history` 🔒

Records a chapter read by the user.

**Request Body:**
```json
{
  "book": "Matthew",
  "chapter": 5
}
```

---

## Reminders

### Get All Reminders
**GET** `/api/reminders` 🔒

Returns all reminders for the authenticated user.

**Response (200):**
```json
[
  {
    "id": "507f1f77bcf86cd799439011",
    "title": "Morning Prayer",
    "description": "Daily morning prayer time",
    "time": "07:00",
    "days": ["monday", "tuesday", "wednesday", "thursday", "friday"],
    "prayerType": "morning",
    "enabled": true,
    "createdAt": "2024-01-01T00:00:00.000Z"
  }
]
```

### Create Reminder
**POST** `/api/reminders` 🔒

Creates a new prayer reminder.

**Request Body:**
```json
{
  "title": "Evening Prayer",
  "description": "Daily evening prayer",
  "time": "20:00",
  "days": ["monday", "tuesday", "wednesday", "thursday", "friday", "saturday", "sunday"],
  "prayerType": "evening"
}
```

**Prayer Types:**
- `morning` - Morning prayers
- `evening` - Evening prayers
- `rosary` - Rosary prayer
- `angelus` - Angelus prayer
- `divine_mercy` - Divine Mercy Chaplet
- `custom` - Custom prayer

**Time Format:** "HH:MM" (24-hour format)

### Update Reminder
**PUT** `/api/reminders/:id` 🔒

Updates an existing reminder.

### Delete Reminder
**DELETE** `/api/reminders/:id` 🔒

Deletes a reminder.

---

## Prayers

### Get All Prayers
**GET** `/api/prayers`

Returns all prayers (public endpoint).

### Get Prayers by Denomination
**GET** `/api/prayers/:denomination`

Returns prayers for a specific denomination.

**Denominations:**
- `catholic`
- `protestant`
- `orthodox`
- `anglican`
- `common`

---

## Bible

### Get Translations
**GET** `/api/bible/translations`

Returns available Bible translations.

### Get Books
**GET** `/api/bible/books`

Returns all Bible books.

### Get Chapter
**GET** `/api/bible/:translation/:book/:chapter`

Returns a specific Bible chapter.

**Example:**
```
GET /api/bible/KJV/John/3
```

---

## Rate Limits

- **General API endpoints:** 100 requests per 15 minutes per IP
- **Authentication endpoints:** 5 requests per 15 minutes per IP

---

## Error Responses

All errors follow this format:

```json
{
  "error": "Error message here"
}
```

**Common Status Codes:**
- `400` - Bad Request (validation errors)
- `401` - Unauthorized (missing or invalid token)
- `404` - Not Found
- `429` - Too Many Requests (rate limit exceeded)
- `500` - Internal Server Error

**Validation Errors:**
```json
{
  "errors": [
    {
      "msg": "Email is required",
      "param": "email",
      "location": "body"
    }
  ]
}
```

---

## Health Check

**GET** `/health`

Returns the API health status.

**Response (200):**
```json
{
  "status": "ok",
  "message": "Christian Companion API is running",
  "database": "connected",
  "timestamp": "2024-01-01T00:00:00.000Z"
}
```

---

🔒 = Requires authentication
