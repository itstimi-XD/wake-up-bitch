# Weather Integration

## Overview

The Weather Integration feature provides real-time weather data to enhance the alarm experience with contextual information and motivational messages.

## Features

- ✅ Real-time weather data by GPS coordinates
- ✅ Weather lookup by city name
- ✅ Contextual motivational messages based on weather conditions
- ✅ Temperature, humidity, wind speed data
- ✅ Sunrise/sunset times
- ✅ Weather icons for UI display

## API Provider

We use **OpenWeatherMap API** (free tier):
- Free tier: 60 calls/minute, 1,000,000 calls/month
- More than enough for our needs
- Reliable and well-documented

## Setup

### 1. Get OpenWeatherMap API Key

1. Go to [OpenWeatherMap](https://openweathermap.org/)
2. Sign up for a free account
3. Navigate to **API keys** section
4. Copy your API key
5. Note: It may take a few hours for the key to activate

### 2. Configure Environment

Add to your `.env` file:

```bash
OPENWEATHER_API_KEY=your-api-key-here
```

## API Endpoints

### GET /api/v1/weather/current

Get weather by GPS coordinates.

**Query Parameters:**
- `latitude` (number, required): Latitude coordinate
- `longitude` (number, required): Longitude coordinate

**Example Request:**
```bash
curl -X GET "http://localhost:3000/api/v1/weather/current?latitude=37.5665&longitude=126.978" \
  -H "Authorization: Bearer YOUR_JWT_TOKEN"
```

**Example Response:**
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

### GET /api/v1/weather/city

Get weather by city name.

**Query Parameters:**
- `city` (string, required): City name
- `country` (string, optional): Country code (ISO 3166)

**Example Request:**
```bash
curl -X GET "http://localhost:3000/api/v1/weather/city?city=Seoul&country=KR" \
  -H "Authorization: Bearer YOUR_JWT_TOKEN"
```

**Example Response:**
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

## Weather Icon Codes

OpenWeatherMap provides icon codes for UI display:

| Code | Description |
|------|-------------|
| 01d  | Clear sky (day) |
| 01n  | Clear sky (night) |
| 02d  | Few clouds (day) |
| 02n  | Few clouds (night) |
| 03d/n| Scattered clouds |
| 04d/n| Broken clouds |
| 09d/n| Shower rain |
| 10d  | Rain (day) |
| 10n  | Rain (night) |
| 11d/n| Thunderstorm |
| 13d/n| Snow |
| 50d/n| Mist |

Icon URL format: `https://openweathermap.org/img/wn/{icon}@2x.png`

Example: `https://openweathermap.org/img/wn/01d@2x.png`

## Motivational Messages

The system generates contextual motivational messages based on weather conditions:

| Condition | Temperature | Message |
|-----------|-------------|---------|
| Any       | < 0°C       | 밖은 엄청 추워! 일찍 일어나서 따뜻한 커피 한 잔 어때? ☕️ |
| Any       | < 10°C      | 쌀쌀한 날씨네요. 일찍 일어나서 따뜻하게 준비하세요! 🧥 |
| Any       | > 30°C      | 더운 날씨! 일찍 일어나서 시원한 아침 공기를 즐기세요! 🌞 |
| Clear     | Normal      | 맑은 하늘이네요! 일어나기 좋은 날씨예요 ☀️ |
| Clouds    | Normal      | 구름 낀 날씨. 일찍 일어나서 생산적인 하루 시작! ☁️ |
| Rain      | Normal      | 비 오는 날! 일찍 일어나서 빗소리 들으며 여유로운 아침을 🌧️ |
| Thunderstorm | Normal   | 천둥번개가! 일찍 일어나서 안전하게 준비하세요 ⚡️ |
| Snow      | Normal      | 눈 오는 날! 일찍 일어나서 눈 구경하세요 ❄️ |
| Mist/Fog  | Normal      | 안개 낀 아침. 조심히 준비하세요! 🌫️ |

## Usage in App

### Alarm Screen Enhancement

When user opens the alarm screen in the morning:

```dart
// Flutter example
final weather = await weatherService.getCurrentWeather(
  latitude: userLocation.latitude,
  longitude: userLocation.longitude,
);

// Display weather card
WeatherCard(
  temperature: weather.temperature,
  condition: weather.condition,
  icon: weather.icon,
  message: weather.motivationalMessage,
);
```

### Mission Context

Enhance mission screens with weather context:

```dart
// Example: COFFEE_RUN mission
if (weather.temperature < 10) {
  missionDescription = "밖은 추워요! 따뜻한 커피 한 잔 하러 가세요 ☕️";
} else {
  missionDescription = "커피 타러 가세요! ☕️";
}
```

## Error Handling

### API Key Not Configured

If `OPENWEATHER_API_KEY` is not set:

**Response:**
```json
{
  "statusCode": 503,
  "message": "Weather service not configured",
  "error": "Service Unavailable"
}
```

### Invalid Coordinates/City

If coordinates or city are invalid:

**Response:**
```json
{
  "statusCode": 503,
  "message": "Failed to fetch weather data",
  "error": "Service Unavailable"
}
```

## Rate Limiting

OpenWeatherMap free tier limits:
- **60 calls/minute**
- **1,000,000 calls/month**

**Recommendations:**
- Cache weather data for 10-30 minutes (weather doesn't change that frequently)
- Only fetch weather when user opens alarm screen or mission
- Use Redis cache to reduce API calls

## Future Enhancements

- [ ] Weather-based mission recommendations (e.g., suggest indoor missions on rainy days)
- [ ] Weather alerts for severe conditions
- [ ] Historical weather tracking for user statistics
- [ ] Weather forecasts (5-day forecast API)
- [ ] Location-based automatic weather updates

## Testing

### Manual Testing

1. Get API key from OpenWeatherMap
2. Add to `.env` file
3. Start backend server
4. Test with curl:

```bash
# Test by coordinates (Seoul)
curl -X GET "http://localhost:3000/api/v1/weather/current?latitude=37.5665&longitude=126.978" \
  -H "Authorization: Bearer YOUR_JWT_TOKEN"

# Test by city
curl -X GET "http://localhost:3000/api/v1/weather/city?city=Seoul&country=KR" \
  -H "Authorization: Bearer YOUR_JWT_TOKEN"
```

### Integration Testing

```typescript
describe('WeatherController', () => {
  it('should return weather data for valid coordinates', async () => {
    const result = await request(app.getHttpServer())
      .get('/api/v1/weather/current?latitude=37.5665&longitude=126.978')
      .set('Authorization', `Bearer ${validToken}`)
      .expect(200);

    expect(result.body).toHaveProperty('temperature');
    expect(result.body).toHaveProperty('motivationalMessage');
  });
});
```

## Cost Estimation

With OpenWeatherMap free tier (1M calls/month):

| Users | Calls/User/Day | Total Calls/Month | Cost |
|-------|----------------|-------------------|------|
| 1,000 | 5             | 150,000           | FREE |
| 10,000| 5             | 1,500,000         | FREE (or $0.0012/call after 1M) |
| 100,000| 5            | 15,000,000        | ~$18/month |

**Recommendation:** Use caching to stay within free tier limits!

## References

- [OpenWeatherMap API Documentation](https://openweathermap.org/api)
- [OpenWeatherMap Current Weather API](https://openweathermap.org/current)
- [Weather Icon Codes](https://openweathermap.org/weather-conditions)
