# 🌍 Rebite API Documentation

**Base URL:** `http://localhost:8000/api`

## Authentication

All protected endpoints require a Bearer token in the Authorization header:

```
Authorization: Bearer <your-jwt-token>
```

## Authentication Endpoints

### Register User
```http
POST /auth/register
Content-Type: application/json

{
  "email": "user@example.com",
  "password": "securepassword123",
  "firstName": "John",
  "lastName": "Doe",
  "role": "consumer"
}
```

**Response:**
```json
{
  "message": "User registered successfully. Please check your email for verification.",
  "user": {
    "id": "uuid",
    "email": "user@example.com",
    "role": "consumer"
  },
  "tokens": {
    "accessToken": "jwt-token",
    "refreshToken": "refresh-token"
  }
}
```

### Login
```http
POST /auth/login
Content-Type: application/json

{
  "email": "user@example.com",
  "password": "securepassword123"
}
```

**Response:**
```json
{
  "message": "Login successful",
  "user": {
    "id": "uuid",
    "email": "user@example.com",
    "role": "consumer",
    "emailVerified": true,
    "firstName": "John",
    "lastName": "Doe",
    "totalPoints": 150,
    "streakDays": 7
  },
  "tokens": {
    "accessToken": "jwt-token",
    "refreshToken": "refresh-token"
  }
}
```

### Refresh Token
```http
POST /auth/refresh
Content-Type: application/json

{
  "refreshToken": "refresh-token"
}
```

### Forgot Password
```http
POST /auth/forgot-password
Content-Type: application/json

{
  "email": "user@example.com"
}
```

### Reset Password
```http
POST /auth/reset-password
Content-Type: application/json

{
  "token": "reset-token",
  "password": "newpassword123"
}
```

## User Management

### Get User Profile
```http
GET /users/profile
Authorization: Bearer <token>
```

**Response:**
```json
{
  "id": "uuid",
  "email": "user@example.com",
  "firstName": "John",
  "lastName": "Doe",
  "phoneNumber": "+1234567890",
  "dateOfBirth": "1990-01-01",
  "gender": "male",
  "nutritionGoals": {
    "goal": "weight_loss",
    "target": 50
  },
  "allergies": ["nuts", "dairy"],
  "dietPreferences": ["vegan", "gluten-free"],
  "valueBars": {
    "Discipline": {
      "level": 2,
      "progress": 64
    },
    "Mindfulness": {
      "level": 1,
      "progress": 45
    }
  },
  "totalPoints": 150,
  "streakDays": 7,
  "location": {
    "latitude": 40.7128,
    "longitude": -74.0060
  }
}
```

### Update User Profile
```http
PUT /users/profile
Authorization: Bearer <token>
Content-Type: application/json

{
  "firstName": "John",
  "lastName": "Doe",
  "phoneNumber": "+1234567890",
  "nutritionGoals": {
    "goal": "muscle_gain",
    "target": 20
  },
  "allergies": ["nuts"],
  "dietPreferences": ["vegan"]
}
```

## Vendor Management

### Create Vendor Profile
```http
POST /vendors
Authorization: Bearer <token>
Content-Type: application/json

{
  "vendorType": "farmer",
  "displayName": "Green Valley Farms",
  "bio": "Organic produce from our family farm",
  "address": "123 Farm Road",
  "city": "Springfield",
  "state": "IL",
  "zipCode": "62701",
  "country": "US",
  "phoneNumber": "+1234567890",
  "website": "https://greenvalleyfarms.com",
  "businessHours": {
    "monday": "8:00-18:00",
    "tuesday": "8:00-18:00",
    "wednesday": "8:00-18:00",
    "thursday": "8:00-18:00",
    "friday": "8:00-18:00",
    "saturday": "8:00-16:00",
    "sunday": "closed"
  },
  "deliveryRadius": 15.0,
  "deliveryFee": 5.0,
  "minOrderAmount": 1000
}
```

### Get Vendor Profile
```http
GET /vendors/{vendorId}
```

### Update Vendor Profile
```http
PUT /vendors/{vendorId}
Authorization: Bearer <token>
Content-Type: application/json

{
  "displayName": "Updated Farm Name",
  "bio": "Updated bio",
  "deliveryRadius": 20.0
}
```

## Listings Management

### Create Listing
```http
POST /listings
Authorization: Bearer <token>
Content-Type: application/json

{
  "title": "Fresh Organic Tomatoes",
  "description": "Locally grown organic tomatoes",
  "category": "produce",
  "foodType": "produce",
  "tags": ["organic", "local", "fresh"],
  "priceCents": 500,
  "originalPriceCents": 800,
  "quantityAvailable": 50,
  "unit": "lbs",
  "expiresAt": "2024-01-15T23:59:59Z",
  "qualityGrade": "good",
  "imperfectionDetails": "Slightly irregular shapes",
  "nutrition": {
    "calories": 22,
    "protein": 1.1,
    "carbs": 4.8,
    "fat": 0.2,
    "fiber": 1.2
  },
  "ingredients": ["tomatoes"],
  "isOrganic": true,
  "isLocal": true,
  "isGlutenFree": true,
  "isVegan": true,
  "images": ["https://example.com/tomato1.jpg"]
}
```

### Get Listings (Feed)
```http
GET /listings?page=1&limit=20&category=produce&maxPrice=1000&location=40.7128,-74.0060&radius=10
```

**Query Parameters:**
- `page`: Page number (default: 1)
- `limit`: Items per page (default: 20, max: 100)
- `category`: Filter by category
- `foodType`: Filter by food type
- `maxPrice`: Maximum price in cents
- `minPrice`: Minimum price in cents
- `location`: Latitude,longitude
- `radius`: Search radius in miles
- `qualityGrade`: Filter by quality grade
- `isOrganic`: Filter organic items
- `isLocal`: Filter local items
- `expiresAfter`: Filter items expiring after date
- `rescueScore`: Minimum rescue score

**Response:**
```json
{
  "listings": [
    {
      "id": "uuid",
      "vendorId": "vendor-uuid",
      "vendorName": "Green Valley Farms",
      "title": "Fresh Organic Tomatoes",
      "description": "Locally grown organic tomatoes",
      "category": "produce",
      "foodType": "produce",
      "tags": ["organic", "local", "fresh"],
      "priceCents": 500,
      "originalPriceCents": 800,
      "quantityAvailable": 50,
      "unit": "lbs",
      "expiresAt": "2024-01-15T23:59:59Z",
      "qualityGrade": "good",
      "rescueScore": 85,
      "nutrition": {
        "calories": 22,
        "protein": 1.1,
        "carbs": 4.8,
        "fat": 0.2,
        "fiber": 1.2
      },
      "isOrganic": true,
      "isLocal": true,
      "images": ["https://example.com/tomato1.jpg"],
      "primaryImage": "https://example.com/tomato1.jpg",
      "valueAlignment": {
        "Discipline": 3.2,
        "Mindfulness": 5.1,
        "Prudence": 2.8,
        "Empathy": 4.2
      }
    }
  ],
  "pagination": {
    "page": 1,
    "limit": 20,
    "total": 150,
    "pages": 8
  }
}
```

### Get Listing Details
```http
GET /listings/{listingId}
```

### Update Listing
```http
PUT /listings/{listingId}
Authorization: Bearer <token>
Content-Type: application/json

{
  "title": "Updated Title",
  "priceCents": 600,
  "quantityAvailable": 40
}
```

### Delete Listing
```http
DELETE /listings/{listingId}
Authorization: Bearer <token>
```

## Orders Management

### Create Order
```http
POST /orders
Authorization: Bearer <token>
Content-Type: application/json

{
  "vendorId": "vendor-uuid",
  "orderType": "delivery",
  "items": [
    {
      "listingId": "listing-uuid",
      "quantity": 2
    }
  ],
  "deliveryAddress": "123 Main St",
  "deliveryCity": "Springfield",
  "deliveryState": "IL",
  "deliveryZipCode": "62701",
  "deliveryInstructions": "Leave at front door",
  "paymentMethod": "card",
  "customerNotes": "Please ensure fresh produce"
}
```

**Response:**
```json
{
  "order": {
    "id": "uuid",
    "orderNumber": "RB-2024-001",
    "status": "pending",
    "subtotalCents": 1000,
    "deliveryFeeCents": 500,
    "taxCents": 75,
    "totalCents": 1575,
    "pointsEarned": 15,
    "estimatedDeliveryTime": "2024-01-10T18:00:00Z",
    "items": [
      {
        "id": "uuid",
        "title": "Fresh Organic Tomatoes",
        "quantity": 2,
        "unitPriceCents": 500,
        "totalPriceCents": 1000
      }
    ]
  },
  "paymentIntent": {
    "clientSecret": "pi_xxx_secret_xxx"
  }
}
```

### Get Orders
```http
GET /orders?page=1&limit=20&status=pending
Authorization: Bearer <token>
```

### Get Order Details
```http
GET /orders/{orderId}
Authorization: Bearer <token>
```

### Update Order Status
```http
PUT /orders/{orderId}/status
Authorization: Bearer <token>
Content-Type: application/json

{
  "status": "confirmed",
  "message": "Order confirmed and being prepared"
}
```

## Points & Rewards

### Get Points Balance
```http
GET /points/balance
Authorization: Bearer <token>
```

**Response:**
```json
{
  "totalPoints": 150,
  "availablePoints": 120,
  "pendingPoints": 30,
  "valueBars": {
    "Discipline": {
      "level": 2,
      "progress": 64
    },
    "Mindfulness": {
      "level": 1,
      "progress": 45
    }
  }
}
```

### Get Points History
```http
GET /points/history?page=1&limit=20
Authorization: Bearer <token>
```

### Gift Points
```http
POST /points/gift
Authorization: Bearer <token>
Content-Type: application/json

{
  "recipientEmail": "friend@example.com",
  "points": 50,
  "message": "Happy birthday!"
}
```

### Donate Points
```http
POST /points/donate
Authorization: Bearer <token>
Content-Type: application/json

{
  "points": 100,
  "charity": "food_bank",
  "message": "Supporting local food banks"
}
```

## Recipes

### Get Recipe Suggestions
```http
GET /recipes/suggestions?ingredients=tomato,onion,garlic&diet=vegan&maxTime=30
```

**Response:**
```json
{
  "recipes": [
    {
      "id": "recipe-uuid",
      "title": "Fresh Tomato Salsa",
      "description": "A delicious fresh salsa made with local tomatoes",
      "prepTime": 15,
      "cookTime": 0,
      "servings": 4,
      "difficulty": "easy",
      "ingredients": [
        {
          "name": "tomatoes",
          "amount": 4,
          "unit": "medium",
          "inCart": true
        },
        {
          "name": "onion",
          "amount": 1,
          "unit": "small",
          "inCart": true
        },
        {
          "name": "garlic",
          "amount": 2,
          "unit": "cloves",
          "inCart": true
        },
        {
          "name": "lime",
          "amount": 1,
          "unit": "medium",
          "inCart": false,
          "estimatedCost": 50
        }
      ],
      "instructions": [
        "Dice tomatoes and onion",
        "Mince garlic",
        "Combine all ingredients",
        "Season to taste"
      ],
      "nutrition": {
        "calories": 45,
        "protein": 2.1,
        "carbs": 9.8,
        "fat": 0.3
      },
      "image": "https://example.com/salsa.jpg",
      "valueAlignment": {
        "Discipline": 4.2,
        "Mindfulness": 6.1,
        "Prudence": 3.8,
        "Empathy": 5.2
      }
    }
  ]
}
```

## USSD Endpoints

### USSD Session
```http
POST /ussd
Content-Type: application/json

{
  "sessionId": "session-uuid",
  "phoneNumber": "+1234567890",
  "text": "1",
  "serviceCode": "*123#"
}
```

**Response:**
```json
{
  "sessionId": "session-uuid",
  "message": "Welcome to Rebite!\n\n1. View rescued food\n2. My Goals\n3. My Points\n4. Place Order\n\nReply with your choice:",
  "status": "continue"
}
```

## WebSocket Events

### Connection
```javascript
const socket = io('http://localhost:8000', {
  auth: {
    token: 'your-jwt-token'
  }
});
```

### Listen for Events
```javascript
// Order updates
socket.on('order:status_update', (data) => {
  console.log('Order updated:', data);
});

// New listings
socket.on('listing:new', (data) => {
  console.log('New listing:', data);
});

// Value bar updates
socket.on('value:updated', (data) => {
  console.log('Value updated:', data);
});

// Points earned
socket.on('points:earned', (data) => {
  console.log('Points earned:', data);
});

// Level up notifications
socket.on('value:level_up', (data) => {
  console.log('Level up:', data);
});
```

### Emit Events
```javascript
// Update order status
socket.emit('order:update', {
  orderId: 'order-uuid',
  status: 'confirmed',
  message: 'Order confirmed'
});

// Create new listing
socket.emit('listing:create', {
  vendorId: 'vendor-uuid',
  listingData: {
    title: 'Fresh Produce',
    priceCents: 500
  }
});

// Update value bar
socket.emit('value:update', {
  userId: 'user-uuid',
  valueName: 'Discipline',
  newProgress: 75,
  levelUp: false
});
```

## Error Responses

All endpoints return consistent error responses:

```json
{
  "error": true,
  "message": "Error description",
  "code": "ERROR_CODE",
  "details": {
    "field": "Additional error details"
  }
}
```

### Common Error Codes
- `VALIDATION_ERROR`: Input validation failed
- `AUTHENTICATION_ERROR`: Invalid or missing authentication
- `AUTHORIZATION_ERROR`: Insufficient permissions
- `NOT_FOUND`: Resource not found
- `CONFLICT`: Resource conflict
- `RATE_LIMIT_EXCEEDED`: Too many requests
- `INTERNAL_ERROR`: Server error

## Rate Limiting

- **Authentication endpoints**: 5 requests per minute
- **General API**: 100 requests per 15 minutes
- **File uploads**: 10 requests per hour

## Pagination

All list endpoints support pagination:

```json
{
  "data": [...],
  "pagination": {
    "page": 1,
    "limit": 20,
    "total": 150,
    "pages": 8,
    "hasNext": true,
    "hasPrev": false
  }
}
```

## File Uploads

### Upload Image
```http
POST /upload/image
Authorization: Bearer <token>
Content-Type: multipart/form-data

{
  "file": <image-file>,
  "type": "listing" // or "profile", "vendor"
}
```

**Response:**
```json
{
  "url": "https://rebite-images.s3.amazonaws.com/image-uuid.jpg",
  "filename": "image-uuid.jpg",
  "size": 1024000,
  "mimeType": "image/jpeg"
}
```

## Health Check

```http
GET /health
```

**Response:**
```json
{
  "status": "OK",
  "timestamp": "2024-01-10T12:00:00Z",
  "version": "1.0.0",
  "services": {
    "database": "connected",
    "redis": "connected",
    "email": "connected"
  }
}
``` 