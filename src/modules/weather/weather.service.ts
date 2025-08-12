import { Injectable, Logger } from '@nestjs/common';
import { HttpService } from '@nestjs/axios';
import { firstValueFrom } from 'rxjs';

@Injectable()
export class WeatherService {
  private readonly logger = new Logger(WeatherService.name);
  private readonly apiKey = process.env.TOMORROW_IO_API_KEY;
  private readonly baseUrl = process.env.TOMORROW_IO_BASE_URL || 'https://api.tomorrow.io/v4/weather/realtime';

  constructor(private readonly httpService: HttpService) {}

  async getWeatherData(location: string) {
    try {
      if (!this.apiKey) {
        throw new Error('Tomorrow.io API key not configured');
      }

      // Clean up location string - remove commas and extra spaces
      const cleanLocation = location.replace(/,/g, '').trim();
      
      const params = {
        location: cleanLocation,
        apikey: this.apiKey,
      };

      const response = await firstValueFrom(
        this.httpService.get(this.baseUrl, { params })
      );

      return response.data;
    } catch (error) {
      this.logger.error(`Error fetching weather data for ${location}:`, error.message);
      
      // Handle Tomorrow.io specific validation errors
      if (error.response?.data?.code === 400001) {
        throw new Error(`Invalid location name: "${location}". Please check the spelling and try again.`);
      }
      
      // Handle other HTTP errors
      if (error.response?.status) {
        throw new Error(`Weather API error (${error.response.status}): ${error.response.data?.message || error.message}`);
      }
      
      // Handle other errors
      throw new Error(`Failed to fetch weather data: ${error.message}`);
    }
  }
}
