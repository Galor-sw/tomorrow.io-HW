import { Injectable, NotFoundException, BadRequestException, Logger } from '@nestjs/common';
import { Types } from 'mongoose';
import { AlertsRepo } from '../dal/repos/alerts.repo';
import { CreateAlertDto } from './dtos/create-alert.dto';
import { AlertParameter, Operator, Units } from '../dal/types/alert.types';
import { WeatherService } from '../weather/weather.service';
import { UsersService } from './users.service';
import { ParametersRepo } from '../dal/repos/parameters.repo';

@Injectable()
export class AlertsService {
  private readonly logger = new Logger(AlertsService.name);

  constructor(
    private readonly alertsRepo: AlertsRepo,
    private readonly weatherService: WeatherService,
    private readonly usersService: UsersService,
    private readonly parametersRepo: ParametersRepo,
  ) {}

  async create(dto: CreateAlertDto) {
    // Validate user exists
    try {
      await this.usersService.findById(dto.userId);
    } catch (error) {
      throw new NotFoundException(`User with ID ${dto.userId} not found`);
    }

    // Validate parameter exists in database
    const validParameters = await this.parametersRepo.getParameterNames();
    if (!validParameters.includes(dto.parameter)) {
      throw new BadRequestException(`Invalid parameter: ${dto.parameter}. Valid parameters are: ${validParameters.join(', ')}`);
    }

    // Validate location exists by making a weather API call
    try {
      this.logger.log(`Validating location: ${dto.locationText}`);
      const weatherData = await this.weatherService.getWeatherData(dto.locationText);
      
      // If we get here, the location is valid
      this.logger.log(`Location validated successfully: ${dto.locationText}`);
      
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
      
      const createdAlert = await this.alertsRepo.create(alertData);
      
      // Add the alert to the user's alerts array
      await this.usersService.addAlertToUser(dto.userId, createdAlert._id);
      
      return createdAlert;
    } catch (error) {
      // Convert weather service errors to proper HTTP exceptions
      if (error.message && error.message.includes('Invalid location name')) {
        throw new BadRequestException(error.message);
      }
      
      // Handle other weather API errors
      if (error.message && error.message.includes('Weather API error')) {
        throw new BadRequestException(error.message);
      }
      
      // Handle other errors
      throw new BadRequestException(`Failed to validate location: ${error.message}`);
    }
  }

  async findAll() {
    return this.alertsRepo.findAll();
  }

  async findById(alertId: string) {
    const alert = await this.alertsRepo.findById(new Types.ObjectId(alertId));
    if (!alert) {
      throw new NotFoundException(`Alert with ID ${alertId} not found`);
    }
    return alert;
  }

  async delete(alertId: string) {
    // First check if alert exists
    const alert = await this.alertsRepo.findById(new Types.ObjectId(alertId));
    if (!alert) {
      throw new NotFoundException(`Alert with ID ${alertId} not found`);
    }

    // Delete the alert
    const deletedAlert = await this.alertsRepo.deleteById(new Types.ObjectId(alertId));
    
    // Remove the alert from the user's alerts array
    await this.usersService.removeAlertFromUser(alert.userId.toString(), new Types.ObjectId(alertId));
    
    return { message: 'Alert deleted successfully', deletedAlert };
  }

  async getWeatherData(location: string) {
    // API Gateway orchestrates the call to Weather Service
    this.logger.log(`API Gateway: Fetching weather for ${location}`);
    const weatherData = await this.weatherService.getWeatherData(location);
    this.logger.log(`API Gateway: Weather data received for ${location}`);
    return weatherData;
  }
}
