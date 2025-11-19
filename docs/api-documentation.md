# Wake Up Bitch - API Documentation

## Base URL

```
Development: http://localhost:3000/api/v1
Production: https://api.wakeupbitch.com/api/v1
```

## Authentication

All API endpoints (except `/auth/register` and `/auth/login`) require JWT authentication.

### Headers

```http
Authorization: Bearer <your-jwt-token>
Content-Type: application/json
```

---

## Authentication Endpoints

### Register

Create a new user account.

**Endpoint:** `POST /auth/register`

**Request Body:**
```json
{
  "email": "user@example.com",
  "password": "SecurePass123!",
  "username": "john_doe"
}
```

**Response:** `201 Created`
```json
{
  "user": {
    "id": "uuid-1234-5678",
    "email": "user@example.com",
    "username": "john_doe",
    "createdAt": "2024-11-19T10:00:00.000Z"
  },
  "accessToken": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9..."
}
```

**Errors:**
- `400` - Validation error (email already exists, weak password, etc.)

---

### Login

Authenticate and get access token.

**Endpoint:** `POST /auth/login`

**Request Body:**
```json
{
  "email": "user@example.com",
  "password": "SecurePass123!"
}
```

**Response:** `200 OK`
```json
{
  "user": {
    "id": "uuid-1234-5678",
    "email": "user@example.com",
    "username": "john_doe"
  },
  "accessToken": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9..."
}
```

**Errors:**
- `401` - Invalid credentials

---

## Alarm Endpoints

### Create Alarm

Create a new alarm with missions.

**Endpoint:** `POST /alarms`

**Headers:** `Authorization: Bearer <token>`

**Request Body:**
```json
{
  "name": "월세 각성",
  "time": "07:00",
  "daysOfWeek": [1, 2, 3, 4, 5],
  "isActive": true,
  "missionIds": ["uuid-mission-1", "uuid-mission-2"]
}
```

**Response:** `201 Created`
```json
{
  "id": "uuid-alarm-123",
  "userId": "uuid-user-456",
  "name": "월세 각성",
  "time": "07:00",
  "daysOfWeek": [1, 2, 3, 4, 5],
  "isActive": true,
  "missions": [
    {
      "id": "uuid-mission-1",
      "type": "BILLS_DUE",
      "displayName": "청구서가 기다려",
      "difficulty": "MEDIUM"
    }
  ],
  "createdAt": "2024-11-19T10:00:00.000Z"
}
```

---

### Get All Alarms

Get all alarms for the authenticated user.

**Endpoint:** `GET /alarms`

**Headers:** `Authorization: Bearer <token>`

**Response:** `200 OK`
```json
{
  "alarms": [
    {
      "id": "uuid-alarm-123",
      "name": "월세 각성",
      "time": "07:00",
      "daysOfWeek": [1, 2, 3, 4, 5],
      "isActive": true,
      "missions": [...]
    }
  ],
  "total": 5
}
```

---

### Get Alarm by ID

Get a specific alarm.

**Endpoint:** `GET /alarms/:id`

**Response:** `200 OK`
```json
{
  "id": "uuid-alarm-123",
  "userId": "uuid-user-456",
  "name": "월세 각성",
  "time": "07:00",
  "daysOfWeek": [1, 2, 3, 4, 5],
  "isActive": true,
  "missions": [...],
  "createdAt": "2024-11-19T10:00:00.000Z"
}
```

**Errors:**
- `404` - Alarm not found

---

### Update Alarm

Update an existing alarm.

**Endpoint:** `PUT /alarms/:id`

**Request Body:**
```json
{
  "name": "새벽 기상",
  "time": "06:30",
  "daysOfWeek": [1, 2, 3, 4, 5, 6],
  "isActive": true,
  "missionIds": ["uuid-mission-1"]
}
```

**Response:** `200 OK`
```json
{
  "id": "uuid-alarm-123",
  "name": "새벽 기상",
  "time": "06:30",
  ...
}
```

---

### Delete Alarm

Delete an alarm.

**Endpoint:** `DELETE /alarms/:id`

**Response:** `204 No Content`

---

### Toggle Alarm

Enable/disable an alarm.

**Endpoint:** `PUT /alarms/:id/toggle`

**Response:** `200 OK`
```json
{
  "id": "uuid-alarm-123",
  "isActive": false,
  ...
}
```

---

## Mission Endpoints

### Get All Missions

Get all available mission types.

**Endpoint:** `GET /missions`

**Response:** `200 OK`
```json
{
  "missions": [
    {
      "id": "uuid-mission-1",
      "type": "BOSS_FIGHT",
      "displayName": "보스 레이드",
      "description": "아침은 전쟁! 보스를 쓰러뜨려라",
      "difficulty": "MEDIUM",
      "estimatedTime": 60
    },
    {
      "id": "uuid-mission-2",
      "type": "BILLS_DUE",
      "displayName": "청구서가 기다려",
      "description": "월세 내야지? 시간은 돈이다!",
      "difficulty": "EASY",
      "estimatedTime": 45
    }
  ]
}
```

---

## User Profile Endpoints

### Get Profile

Get current user's profile.

**Endpoint:** `GET /users/me`

**Response:** `200 OK`
```json
{
  "id": "uuid-user-123",
  "email": "user@example.com",
  "username": "john_doe",
  "points": 2500,
  "weeklyPoints": 450,
  "successfulAlarms": 120,
  "failedAlarms": 15,
  "currentStreak": 7,
  "longestStreak": 30,
  "financialProfile": {
    "income": {
      "salary": 3000000,
      "total": 3500000
    },
    "fixedExpenses": {
      "rent": 800000,
      "total": 1200000
    },
    "calculated": {
      "dailyExpense": 40000,
      "hourlyExpense": 1667,
      "minuteExpense": 28
    }
  },
  "createdAt": "2024-01-01T00:00:00.000Z"
}
```

---

### Update Financial Profile

Update user's financial information for BILLS_DUE mission.

**Endpoint:** `PUT /users/me/financial-profile`

**Request Body:**
```json
{
  "income": {
    "salary": 3000000,
    "sideHustle": 500000,
    "other": 0
  },
  "fixedExpenses": {
    "rent": 800000,
    "utilities": 150000,
    "insurance": 100000,
    "loan": 300000,
    "subscriptions": 50000,
    "transportation": 100000,
    "other": 50000
  },
  "creditCard": {
    "thisMonthSpent": 500000,
    "paymentDay": 25
  }
}
```

**Response:** `200 OK`
```json
{
  "financialProfile": {
    "income": {...},
    "fixedExpenses": {...},
    "creditCard": {...},
    "calculated": {
      "dailyExpense": 50000,
      "hourlyExpense": 2083,
      "minuteExpense": 35,
      "disposableIncome": 1950000
    }
  }
}
```

---

## Weather Endpoints

### Get Current Weather by Coordinates

Get weather data for GPS coordinates.

**Endpoint:** `GET /weather/current`

**Query Parameters:**
- `latitude` (required): Latitude coordinate
- `longitude` (required): Longitude coordinate

**Example:**
```
GET /weather/current?latitude=37.5665&longitude=126.978
```

**Response:** `200 OK`
```json
{
  "temperature": 15,
  "feelsLike": 13,
  "humidity": 65,
  "condition": "Clear",
  "description": "clear sky",
  "icon": "01d",
  "windSpeed": 3.5,
  "sunrise": "2024-11-19T06:30:00.000Z",
  "sunset": "2024-11-19T17:15:00.000Z",
  "city": "Seoul",
  "country": "KR",
  "motivationalMessage": "맑은 하늘이네요! 일어나기 좋은 날씨예요 ☀️"
}
```

**Errors:**
- `503` - Weather service unavailable

---

### Get Weather by City

Get weather data for a city.

**Endpoint:** `GET /weather/city`

**Query Parameters:**
- `city` (required): City name
- `country` (optional): Country code (ISO 3166)

**Example:**
```
GET /weather/city?city=Seoul&country=KR
```

**Response:** Same as above

---

## Leaderboard Endpoints

### Get Global Leaderboard

Get global leaderboard with top players.

**Endpoint:** `GET /leaderboard/global`

**Query Parameters:**
- `limit` (optional, default: 50): Number of entries (max 100)
- `offset` (optional, default: 0): Pagination offset

**Example:**
```
GET /leaderboard/global?limit=20&offset=0
```

**Response:** `200 OK`
```json
{
  "leaderboard": [
    {
      "userId": "uuid-user-1",
      "username": "super_user",
      "rank": 1,
      "totalPoints": 5000,
      "weeklyPoints": 800,
      "successRate": 95,
      "totalAlarms": 200,
      "successfulAlarms": 190,
      "currentStreak": 45,
      "avatar": "https://example.com/avatar1.jpg"
    },
    {
      "userId": "uuid-user-2",
      "username": "early_bird",
      "rank": 2,
      "totalPoints": 4500,
      "weeklyPoints": 650,
      "successRate": 90,
      "totalAlarms": 180,
      "successfulAlarms": 162,
      "currentStreak": 30
    }
  ],
  "currentUser": {
    "userId": "uuid-me",
    "username": "john_doe",
    "rank": 42,
    "totalPoints": 2500,
    "weeklyPoints": 450,
    "successRate": 85,
    "totalAlarms": 120,
    "successfulAlarms": 102,
    "currentStreak": 7
  },
  "totalPlayers": 1250
}
```

---

### Get Friends Leaderboard

Get leaderboard showing you and your friends.

**Endpoint:** `GET /leaderboard/friends`

**Query Parameters:**
- `limit` (optional, default: 50)
- `offset` (optional, default: 0)

**Response:** Same format as global leaderboard, but only includes friends

---

## Statistics Endpoints

### Get User Statistics

Get detailed statistics for the authenticated user.

**Endpoint:** `GET /stats/me`

**Response:** `200 OK`
```json
{
  "totalAlarms": 120,
  "successfulAlarms": 102,
  "successRate": 85,
  "averageDismissTime": 180,
  "last7Days": [
    {
      "date": "2024-11-13",
      "alarms": 2,
      "successful": 2
    },
    {
      "date": "2024-11-14",
      "alarms": 2,
      "successful": 1
    }
  ],
  "missionStats": [
    {
      "missionType": "BOSS_FIGHT",
      "attempts": 50,
      "successes": 45,
      "successRate": 90
    },
    {
      "missionType": "BILLS_DUE",
      "attempts": 30,
      "successes": 27,
      "successRate": 90
    }
  ]
}
```

---

## Challenge Endpoints

### Create Challenge

Create a new challenge with a friend.

**Endpoint:** `POST /challenges`

**Request Body:**
```json
{
  "challengerId": "uuid-friend-123",
  "title": "일주일 챌린지",
  "description": "누가 더 일찍 일어나나!",
  "betPoints": 500,
  "startDate": "2024-11-20",
  "endDate": "2024-11-27"
}
```

**Response:** `201 Created`
```json
{
  "id": "uuid-challenge-123",
  "creatorId": "uuid-me",
  "challengerId": "uuid-friend-123",
  "title": "일주일 챌린지",
  "betPoints": 500,
  "startDate": "2024-11-20",
  "endDate": "2024-11-27",
  "status": "PENDING",
  "createdAt": "2024-11-19T10:00:00.000Z"
}
```

---

### Get Active Challenges

Get all active challenges for the user.

**Endpoint:** `GET /challenges/active`

**Response:** `200 OK`
```json
{
  "challenges": [
    {
      "id": "uuid-challenge-123",
      "creator": {
        "id": "uuid-me",
        "username": "john_doe"
      },
      "challenger": {
        "id": "uuid-friend-123",
        "username": "jane_smith"
      },
      "title": "일주일 챌린지",
      "betPoints": 500,
      "startDate": "2024-11-20",
      "endDate": "2024-11-27",
      "status": "ACTIVE",
      "currentScore": {
        "creator": 3,
        "challenger": 4
      }
    }
  ]
}
```

---

### Accept Challenge

Accept a pending challenge.

**Endpoint:** `PUT /challenges/:id/accept`

**Response:** `200 OK`
```json
{
  "id": "uuid-challenge-123",
  "status": "ACTIVE",
  ...
}
```

---

### Decline Challenge

Decline a pending challenge.

**Endpoint:** `PUT /challenges/:id/decline`

**Response:** `200 OK`
```json
{
  "id": "uuid-challenge-123",
  "status": "CANCELLED",
  ...
}
```

---

## Friendship Endpoints

### Send Friend Request

Send a friend request to another user.

**Endpoint:** `POST /friends/request`

**Request Body:**
```json
{
  "userId": "uuid-target-user"
}
```

**Response:** `201 Created`
```json
{
  "id": "uuid-friendship-123",
  "requesterId": "uuid-me",
  "addresseeId": "uuid-target-user",
  "status": "PENDING",
  "createdAt": "2024-11-19T10:00:00.000Z"
}
```

---

### Accept Friend Request

Accept a pending friend request.

**Endpoint:** `PUT /friends/:id/accept`

**Response:** `200 OK`
```json
{
  "id": "uuid-friendship-123",
  "status": "ACCEPTED",
  "acceptedAt": "2024-11-19T10:05:00.000Z"
}
```

---

### Get Friends List

Get all accepted friends.

**Endpoint:** `GET /friends`

**Response:** `200 OK`
```json
{
  "friends": [
    {
      "id": "uuid-friend-1",
      "username": "jane_smith",
      "points": 3500,
      "currentStreak": 12,
      "avatar": "https://example.com/avatar.jpg"
    }
  ],
  "total": 15
}
```

---

## Error Responses

All endpoints may return the following error responses:

### 400 Bad Request
```json
{
  "statusCode": 400,
  "message": "Validation failed",
  "errors": [
    {
      "field": "email",
      "message": "Invalid email format"
    }
  ]
}
```

### 401 Unauthorized
```json
{
  "statusCode": 401,
  "message": "Unauthorized",
  "error": "Invalid or expired token"
}
```

### 403 Forbidden
```json
{
  "statusCode": 403,
  "message": "Forbidden",
  "error": "You don't have permission to access this resource"
}
```

### 404 Not Found
```json
{
  "statusCode": 404,
  "message": "Not Found",
  "error": "Resource not found"
}
```

### 500 Internal Server Error
```json
{
  "statusCode": 500,
  "message": "Internal Server Error",
  "error": "Something went wrong"
}
```

---

## Rate Limiting

- **Default:** 100 requests per minute per IP
- **Authentication endpoints:** 5 requests per minute per IP
- Exceeding limits returns `429 Too Many Requests`

---

## Pagination

Endpoints that support pagination use the following query parameters:

- `limit`: Number of items per page (default: 50, max: 100)
- `offset`: Number of items to skip (default: 0)

**Example:**
```
GET /alarms?limit=20&offset=40
```

---

## Swagger/OpenAPI

Interactive API documentation is available at:

```
http://localhost:3000/api/docs
```

This provides:
- Interactive API testing
- Request/response examples
- Schema definitions
- Authentication testing

---

## WebSocket Events (Future)

Coming soon:
- Real-time challenge updates
- Friend online status
- Live leaderboard updates
- Push notifications

---

## SDK Examples

### JavaScript/TypeScript

```typescript
import axios from 'axios';

const api = axios.create({
  baseURL: 'http://localhost:3000/api/v1',
});

// Set auth token
api.defaults.headers.common['Authorization'] = `Bearer ${token}`;

// Create alarm
const alarm = await api.post('/alarms', {
  name: '월세 각성',
  time: '07:00',
  daysOfWeek: [1, 2, 3, 4, 5],
  isActive: true,
  missionIds: ['uuid-mission-1'],
});

// Get leaderboard
const leaderboard = await api.get('/leaderboard/global', {
  params: { limit: 20 },
});
```

### Flutter/Dart

```dart
import 'package:dio/dio.dart';

class ApiService {
  final Dio _dio = Dio(BaseOptions(
    baseUrl: 'http://localhost:3000/api/v1',
  ));

  void setToken(String token) {
    _dio.options.headers['Authorization'] = 'Bearer $token';
  }

  Future<Map<String, dynamic>> createAlarm(Map<String, dynamic> data) async {
    final response = await _dio.post('/alarms', data: data);
    return response.data;
  }

  Future<List<dynamic>> getLeaderboard({int limit = 50}) async {
    final response = await _dio.get('/leaderboard/global',
      queryParameters: {'limit': limit},
    );
    return response.data['leaderboard'];
  }
}
```

---

## Testing

### Using cURL

```bash
# Register
curl -X POST http://localhost:3000/api/v1/auth/register \
  -H "Content-Type: application/json" \
  -d '{"email":"test@test.com","password":"Test123!","username":"testuser"}'

# Login
curl -X POST http://localhost:3000/api/v1/auth/login \
  -H "Content-Type: application/json" \
  -d '{"email":"test@test.com","password":"Test123!"}'

# Create Alarm (with token)
curl -X POST http://localhost:3000/api/v1/alarms \
  -H "Authorization: Bearer YOUR_TOKEN" \
  -H "Content-Type: application/json" \
  -d '{"name":"Test Alarm","time":"07:00","daysOfWeek":[1,2,3,4,5],"isActive":true,"missionIds":[]}'
```

---

## Support

For issues and questions:
- GitHub Issues: https://github.com/yourusername/wake-up-bitch/issues
- Email: support@wakeupbitch.com
- Docs: `/docs` folder in repository
