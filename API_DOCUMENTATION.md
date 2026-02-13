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

## Nigerian Liturgical Resources

### Get All Nigerian Resources
**GET** `/api/nigerian`

Returns an overview of all available Nigerian liturgical resources.

**Response (200):**
```json
{
  "orderOfMass": {
    "description": "Structure and prayers of the Catholic Mass",
    "endpoint": "/api/nigerian/mass/order"
  },
  "dailyReadings": {
    "description": "Information about daily Mass readings",
    "endpoint": "/api/nigerian/readings/daily"
  },
  "sundayReadings": {
    "description": "Structure of Sunday Mass readings",
    "endpoint": "/api/nigerian/readings/sunday"
  },
  "breviary": {
    "description": "Liturgy of the Hours (Divine Office)",
    "endpoint": "/api/nigerian/breviary"
  },
  "missal": {
    "description": "Information about the Roman Missal",
    "endpoint": "/api/nigerian/missal"
  }
}
```

### Get Order of Mass
**GET** `/api/nigerian/mass/order?language=english`

Returns the complete Order of Mass structure with prayers and responses.

**Query Parameters:**
- `language` (optional): Language for the Order of Mass (default: "english")

**Response (200):**
```json
{
  "introductoryRites": {
    "title": "INTRODUCTORY RITES",
    "steps": [...]
  },
  "liturgyOfTheWord": {
    "title": "LITURGY OF THE WORD",
    "steps": [...]
  },
  "liturgyOfTheEucharist": {
    "title": "LITURGY OF THE EUCHARIST",
    "steps": [...]
  },
  "concludingRites": {
    "title": "CONCLUDING RITES",
    "steps": [...]
  }
}
```

### Get Daily Readings Information
**GET** `/api/nigerian/readings/daily`

Returns information about where to find daily Mass readings for Nigerian Catholics.

**Response (200):**
```json
{
  "description": "Daily Mass readings for Nigerian Catholics follow the Roman Catholic Lectionary cycle used worldwide.",
  "sources": [
    {
      "name": "Catholic Bishops' Conference of Nigeria (CBCN)",
      "website": "https://cbcn-ng.org",
      "description": "Official website of the Catholic Bishops' Conference of Nigeria"
    }
  ],
  "note": "Nigerian Catholics follow the same lectionary cycle as the universal Catholic Church..."
}
```

### Get Sunday Readings Structure
**GET** `/api/nigerian/readings/sunday`

Returns the structure of Sunday Mass readings.

### Get Breviary (Liturgy of the Hours)
**GET** `/api/nigerian/breviary`

Returns information about the Liturgy of the Hours (Divine Office/Breviary).

### Get Missal Information
**GET** `/api/nigerian/missal`

Returns information about the Roman Missal and Nigerian adaptations.

---

## Hymns - Language Filtering

### Get Hymns by Language
**GET** `/api/hymns/language/:language`

Returns all hymns in a specific language.

**Example:** `/api/hymns/language/yoruba`

**Response (200):**
```json
[
  {
    "id": "jesu-l'oluwa",
    "title": "Jesu L'Oluwa (Jesus is Lord)",
    "author": "Traditional Nigerian",
    "year": 1900,
    "denomination": "All",
    "category": "Nigerian - Yoruba",
    "language": "Yoruba",
    "firstLine": "Jesu l'oluwa, O je k'a yin O",
    "description": "Traditional Yoruba hymn proclaiming Jesus as Lord...",
    "category": "nigerian",
    "subCategory": "yoruba"
  }
]
```

**Available Languages:**
- `yoruba` - Yoruba language hymns
- `igbo` - Igbo language hymns
- `hausa` - Hausa language hymns
- `english` - English language hymns (when specified)
- `nigerian pidgin` - Nigerian Pidgin English hymns

---

## Prayers - Language Filtering

### Get Prayers by Language
**GET** `/api/prayers/language/:language`

Returns all prayers in a specific language.

**Example:** `/api/prayers/language/igbo`

**Response (200):**
```json
[
  {
    "id": "ekpere-ututo-igbo",
    "title": "Ekpere Ututo (Morning Prayer)",
    "text": "Chineke nna anyi, Anyi na-ekele Gi maka ubochi ohuru a...",
    "language": "Igbo",
    "denomination": "nigerian",
    "category": "igbo"
  }
]
```

**Available Languages:**
- `yoruba` - Yoruba language prayers
- `igbo` - Igbo language prayers
- `hausa` - Hausa language prayers
- `english` - English language prayers (when specified)

---

🔒 = Requires authentication
