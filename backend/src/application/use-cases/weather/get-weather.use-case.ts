import { Injectable, Inject } from '@nestjs/common';
import { IWeatherService, WeatherData } from '@domain/services/weather.service.interface';

interface WeatherWithMotivation extends WeatherData {
  motivationalMessage: string;
}

@Injectable()
export class GetWeatherUseCase {
  constructor(
    @Inject('IWeatherService')
    private readonly weatherService: IWeatherService,
  ) {}

  async executeByCoordinates(
    latitude: number,
    longitude: number,
  ): Promise<WeatherWithMotivation> {
    const weatherData = await this.weatherService.getCurrentWeather(
      latitude,
      longitude,
    );

    return {
      ...weatherData,
      motivationalMessage: this.generateMotivationalMessage(weatherData),
    };
  }

  async executeByCity(
    city: string,
    country?: string,
  ): Promise<WeatherWithMotivation> {
    const weatherData = await this.weatherService.getWeatherByCity(
      city,
      country,
    );

    return {
      ...weatherData,
      motivationalMessage: this.generateMotivationalMessage(weatherData),
    };
  }

  private generateMotivationalMessage(weather: WeatherData): string {
    const { condition, temperature } = weather;

    // Temperature-based messages
    if (temperature < 0) {
      return '밖은 엄청 추워! 일찍 일어나서 따뜻한 커피 한 잔 어때? ☕️';
    } else if (temperature < 10) {
      return '쌀쌀한 날씨네요. 일찍 일어나서 따뜻하게 준비하세요! 🧥';
    } else if (temperature > 30) {
      return '더운 날씨! 일찍 일어나서 시원한 아침 공기를 즐기세요! 🌞';
    }

    // Condition-based messages
    switch (condition.toLowerCase()) {
      case 'clear':
        return '맑은 하늘이네요! 일어나기 좋은 날씨예요 ☀️';

      case 'clouds':
        return '구름 낀 날씨. 일찍 일어나서 생산적인 하루 시작! ☁️';

      case 'rain':
      case 'drizzle':
        return '비 오는 날! 일찍 일어나서 빗소리 들으며 여유로운 아침을 🌧️';

      case 'thunderstorm':
        return '천둥번개가! 일찍 일어나서 안전하게 준비하세요 ⚡️';

      case 'snow':
        return '눈 오는 날! 일찍 일어나서 눈 구경하세요 ❄️';

      case 'mist':
      case 'fog':
        return '안개 낀 아침. 조심히 준비하세요! 🌫️';

      default:
        return `현재 날씨: ${weather.description}. 오늘도 화이팅! 💪`;
    }
  }
}
