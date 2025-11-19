export interface WeatherData {
  temperature: number; // Celsius
  feelsLike: number;
  humidity: number; // Percentage
  condition: string; // Clear, Cloudy, Rain, Snow, etc.
  description: string; // Detailed description
  icon: string; // Weather icon code
  windSpeed: number; // m/s
  sunrise: Date;
  sunset: Date;
  city: string;
  country: string;
}

export interface IWeatherService {
  /**
   * Get current weather for a location
   * @param latitude - Location latitude
   * @param longitude - Location longitude
   * @returns Weather data
   */
  getCurrentWeather(latitude: number, longitude: number): Promise<WeatherData>;

  /**
   * Get current weather by city name
   * @param city - City name
   * @param country - Country code (optional)
   * @returns Weather data
   */
  getWeatherByCity(city: string, country?: string): Promise<WeatherData>;
}
