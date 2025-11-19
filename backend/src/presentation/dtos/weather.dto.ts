import { ApiProperty } from '@nestjs/swagger';
import { IsLatitude, IsLongitude, IsString, IsOptional } from 'class-validator';

export class GetWeatherByCoordinatesDto {
  @ApiProperty({ example: 37.5665, description: 'Latitude' })
  @IsLatitude()
  latitude: number;

  @ApiProperty({ example: 126.978, description: 'Longitude' })
  @IsLongitude()
  longitude: number;
}

export class GetWeatherByCityDto {
  @ApiProperty({ example: 'Seoul', description: 'City name' })
  @IsString()
  city: string;

  @ApiProperty({ example: 'KR', description: 'Country code (ISO 3166)', required: false })
  @IsOptional()
  @IsString()
  country?: string;
}

export class WeatherResponseDto {
  @ApiProperty({ example: 15, description: 'Temperature in Celsius' })
  temperature: number;

  @ApiProperty({ example: 13, description: 'Feels like temperature in Celsius' })
  feelsLike: number;

  @ApiProperty({ example: 65, description: 'Humidity percentage' })
  humidity: number;

  @ApiProperty({ example: 'Clear', description: 'Weather condition' })
  condition: string;

  @ApiProperty({ example: 'clear sky', description: 'Detailed description' })
  description: string;

  @ApiProperty({ example: '01d', description: 'Weather icon code' })
  icon: string;

  @ApiProperty({ example: 3.5, description: 'Wind speed in m/s' })
  windSpeed: number;

  @ApiProperty({ example: '2024-11-19T06:30:00Z', description: 'Sunrise time' })
  sunrise: Date;

  @ApiProperty({ example: '2024-11-19T17:15:00Z', description: 'Sunset time' })
  sunset: Date;

  @ApiProperty({ example: 'Seoul', description: 'City name' })
  city: string;

  @ApiProperty({ example: 'KR', description: 'Country code' })
  country: string;

  @ApiProperty({
    example: '맑은 하늘이네요! 일어나기 좋은 날씨예요 ☀️',
    description: 'Contextual message for mission',
  })
  motivationalMessage: string;
}
