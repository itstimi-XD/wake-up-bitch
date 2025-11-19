import {
  Controller,
  Get,
  Query,
  UseGuards,
  HttpCode,
  HttpStatus,
} from '@nestjs/common';
import {
  ApiTags,
  ApiOperation,
  ApiResponse,
  ApiBearerAuth,
  ApiQuery,
} from '@nestjs/swagger';
import { JwtAuthGuard } from '@presentation/guards/jwt-auth.guard';
import { GetWeatherUseCase } from '@application/use-cases/weather/get-weather.use-case';
import {
  GetWeatherByCoordinatesDto,
  GetWeatherByCityDto,
  WeatherResponseDto,
} from '@presentation/dtos/weather.dto';

@ApiTags('Weather')
@Controller('weather')
@UseGuards(JwtAuthGuard)
@ApiBearerAuth()
export class WeatherController {
  constructor(private readonly getWeatherUseCase: GetWeatherUseCase) {}

  @Get('current')
  @HttpCode(HttpStatus.OK)
  @ApiOperation({
    summary: 'Get current weather by coordinates',
    description: 'Get current weather data for the given GPS coordinates with motivational message',
  })
  @ApiQuery({
    name: 'latitude',
    required: true,
    type: Number,
    example: 37.5665,
    description: 'Latitude coordinate',
  })
  @ApiQuery({
    name: 'longitude',
    required: true,
    type: Number,
    example: 126.978,
    description: 'Longitude coordinate',
  })
  @ApiResponse({
    status: 200,
    description: 'Weather data retrieved successfully',
    type: WeatherResponseDto,
  })
  @ApiResponse({
    status: 503,
    description: 'Weather service unavailable',
  })
  async getCurrentWeather(
    @Query() dto: GetWeatherByCoordinatesDto,
  ): Promise<WeatherResponseDto> {
    return this.getWeatherUseCase.executeByCoordinates(
      dto.latitude,
      dto.longitude,
    );
  }

  @Get('city')
  @HttpCode(HttpStatus.OK)
  @ApiOperation({
    summary: 'Get current weather by city name',
    description: 'Get current weather data for the given city with motivational message',
  })
  @ApiQuery({
    name: 'city',
    required: true,
    type: String,
    example: 'Seoul',
    description: 'City name',
  })
  @ApiQuery({
    name: 'country',
    required: false,
    type: String,
    example: 'KR',
    description: 'Country code (ISO 3166)',
  })
  @ApiResponse({
    status: 200,
    description: 'Weather data retrieved successfully',
    type: WeatherResponseDto,
  })
  @ApiResponse({
    status: 503,
    description: 'Weather service unavailable',
  })
  async getWeatherByCity(
    @Query() dto: GetWeatherByCityDto,
  ): Promise<WeatherResponseDto> {
    return this.getWeatherUseCase.executeByCity(dto.city, dto.country);
  }
}
