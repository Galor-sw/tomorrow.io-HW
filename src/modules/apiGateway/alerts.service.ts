import { Injectable } from '@nestjs/common';
import { Types } from 'mongoose';
import { AlertsRepo } from '../dal/repos/alerts.repo';
import { CreateAlertDto } from '../api/dtos/create-alert.dto';
import { AlertParameter, Operator, Units } from '../dal/types/alert.types';
import { WeatherService } from '../weather/weather.service';

@Injectable()
export class AlertsService {
  constructor(
    private readonly alertsRepo: AlertsRepo,
    private readonly weatherService: WeatherService,
  ) {}

  async create(dto: CreateAlertDto) {
    // Validate location exists by making a weather API call
    try {
      console.log(`Validating location: ${dto.locationText}`);
      const weatherData = await this.weatherService.getWeatherData(dto.locationText);
      
      // If we get here, the location is valid
      console.log(`Location validated successfully: ${dto.locationText}`);
      
      // Use the coordinates from the weather API response if not provided
      const locationData = weatherData.location;
      const alertData = {
        userId: new Types.ObjectId(dto.userId),
        locationText: dto.locationText,
        lat: dto.lat || locationData.lat,
        lon: dto.lon || locationData.lon,
        parameter: dto.parameter as AlertParameter,
        operator: dto.operator as Operator,
        threshold: dto.threshold,
        description: dto.description,
        units: (dto.units ?? 'metric') as Units,
      };
      
      return this.alertsRepo.create(alertData);
    } catch (error) {
      // Re-throw the error with the same message for invalid locations
      throw error;
    }
  }

  async findAll() {
    return this.alertsRepo.findAll();
  }

  async getWeatherData(location: string) {
    // API Gateway orchestrates the call to Weather Service
    console.log(`API Gateway: Fetching weather for ${location}`);
    const weatherData = await this.weatherService.getWeatherData(location);
    console.log(`API Gateway: Weather data received:`, weatherData);
    return weatherData;
  }
}
