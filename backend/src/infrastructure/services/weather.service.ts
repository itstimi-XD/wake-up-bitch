import { Injectable, Logger, HttpException, HttpStatus } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import axios, { AxiosInstance } from 'axios';
import {
  IWeatherService,
  WeatherData,
} from '@domain/services/weather.service.interface';

interface OpenWeatherMapResponse {
  weather: Array<{
    main: string;
    description: string;
    icon: string;
  }>;
  main: {
    temp: number;
    feels_like: number;
    humidity: number;
  };
  wind: {
    speed: number;
  };
  sys: {
    sunrise: number;
    sunset: number;
    country: string;
  };
  name: string;
}

@Injectable()
export class WeatherService implements IWeatherService {
  private readonly logger = new Logger(WeatherService.name);
  private readonly apiKey: string;
  private readonly baseUrl = 'https://api.openweathermap.org/data/2.5';
  private readonly axiosInstance: AxiosInstance;

  constructor(private configService: ConfigService) {
    this.apiKey = this.configService.get<string>('OPENWEATHER_API_KEY') || '';

    if (!this.apiKey) {
      this.logger.warn('OPENWEATHER_API_KEY not configured. Weather features will be limited.');
    }

    this.axiosInstance = axios.create({
      baseURL: this.baseUrl,
      timeout: 10000,
    });
  }

  async getCurrentWeather(
    latitude: number,
    longitude: number,
  ): Promise<WeatherData> {
    try {
      this.validateApiKey();

      const response = await this.axiosInstance.get<OpenWeatherMapResponse>(
        '/weather',
        {
          params: {
            lat: latitude,
            lon: longitude,
            appid: this.apiKey,
            units: 'metric', // Celsius
          },
        },
      );

      return this.mapToWeatherData(response.data);
    } catch (error) {
      this.logger.error(
        `Failed to fetch weather for coordinates: ${latitude}, ${longitude}`,
        error,
      );
      throw new HttpException(
        'Failed to fetch weather data',
        HttpStatus.SERVICE_UNAVAILABLE,
      );
    }
  }

  async getWeatherByCity(
    city: string,
    country?: string,
  ): Promise<WeatherData> {
    try {
      this.validateApiKey();

      const query = country ? `${city},${country}` : city;

      const response = await this.axiosInstance.get<OpenWeatherMapResponse>(
        '/weather',
        {
          params: {
            q: query,
            appid: this.apiKey,
            units: 'metric',
          },
        },
      );

      return this.mapToWeatherData(response.data);
    } catch (error) {
      this.logger.error(`Failed to fetch weather for city: ${city}`, error);
      throw new HttpException(
        'Failed to fetch weather data',
        HttpStatus.SERVICE_UNAVAILABLE,
      );
    }
  }

  private validateApiKey(): void {
    if (!this.apiKey) {
      throw new HttpException(
        'Weather service not configured',
        HttpStatus.SERVICE_UNAVAILABLE,
      );
    }
  }

  private mapToWeatherData(data: OpenWeatherMapResponse): WeatherData {
    return {
      temperature: Math.round(data.main.temp),
      feelsLike: Math.round(data.main.feels_like),
      humidity: data.main.humidity,
      condition: data.weather[0].main,
      description: data.weather[0].description,
      icon: data.weather[0].icon,
      windSpeed: data.wind.speed,
      sunrise: new Date(data.sys.sunrise * 1000),
      sunset: new Date(data.sys.sunset * 1000),
      city: data.name,
      country: data.sys.country,
    };
  }
}
