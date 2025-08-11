import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { Parameter, ParameterDoc } from '../schemas/parameter.schema';

@Injectable()
export class ParametersRepo {
  constructor(@InjectModel(Parameter.name) private model: Model<ParameterDoc>) {}

  create(data: Partial<Parameter>) {
    return this.model.create(data);
  }

  findAll() {
    return this.model.find({ isActive: true }).sort({ sortOrder: 1, name: 1 }).lean();
  }

  findActive() {
    return this.model.find({ isActive: true }).sort({ sortOrder: 1, name: 1 }).lean();
  }

  findByCategory(category: string) {
    return this.model.find({ category, isActive: true }).sort({ sortOrder: 1, name: 1 }).lean();
  }

  findByType(type: 'numeric' | 'categorical') {
    return this.model.find({ type, isActive: true }).sort({ sortOrder: 1, name: 1 }).lean();
  }

  findByName(name: string) {
    return this.model.findOne({ name, isActive: true }).lean();
  }

  async getParameterNames(): Promise<string[]> {
    const parameters = await this.findActive();
    return parameters.map(p => p.name);
  }

  async getNumericParameters(): Promise<string[]> {
    const parameters = await this.findByType('numeric');
    return parameters.map(p => p.name);
  }

  async getCategoricalParameters(): Promise<string[]> {
    const parameters = await this.findByType('categorical');
    return parameters.map(p => p.name);
  }

  async seedParameters() {
    const existingCount = await this.model.countDocuments();
    if (existingCount > 0) {
      console.log('Parameters already seeded, skipping...');
      return;
    }

    const parameters = [
      // Temperature
      { name: 'temperature', displayName: 'Temperature', category: 'temperature', type: 'numeric', unit: '°C', sortOrder: 1 },
      { name: 'temperatureApparent', displayName: 'Feels Like Temperature', category: 'temperature', type: 'numeric', unit: '°C', sortOrder: 2 },
      
      // Precipitation
      { name: 'rainIntensity', displayName: 'Rain Intensity', category: 'precipitation', type: 'numeric', unit: 'mm/h', sortOrder: 3 },
      { name: 'snowIntensity', displayName: 'Snow Intensity', category: 'precipitation', type: 'numeric', unit: 'mm/h', sortOrder: 4 },
      { name: 'sleetIntensity', displayName: 'Sleet Intensity', category: 'precipitation', type: 'numeric', unit: 'mm/h', sortOrder: 5 },
      { name: 'freezingRainIntensity', displayName: 'Freezing Rain Intensity', category: 'precipitation', type: 'numeric', unit: 'mm/h', sortOrder: 6 },
      { name: 'precipitationProbability', displayName: 'Precipitation Probability', category: 'precipitation', type: 'numeric', unit: '%', sortOrder: 7 },
      
      // Atmospheric
      { name: 'humidity', displayName: 'Humidity', category: 'atmospheric', type: 'numeric', unit: '%', sortOrder: 8 },
      { name: 'pressureSurfaceLevel', displayName: 'Surface Pressure', category: 'atmospheric', type: 'numeric', unit: 'hPa', sortOrder: 9 },
      { name: 'dewPoint', displayName: 'Dew Point', category: 'atmospheric', type: 'numeric', unit: '°C', sortOrder: 10 },
      
      // Wind
      { name: 'windSpeed', displayName: 'Wind Speed', category: 'wind', type: 'numeric', unit: 'm/s', sortOrder: 11 },
      { name: 'windDirection', displayName: 'Wind Direction', category: 'wind', type: 'numeric', unit: '°', sortOrder: 12 },
      { name: 'windGust', displayName: 'Wind Gust', category: 'wind', type: 'numeric', unit: 'm/s', sortOrder: 13 },
      
      // Clouds
      { name: 'cloudCover', displayName: 'Cloud Cover', category: 'clouds', type: 'numeric', unit: '%', sortOrder: 14 },
      { name: 'cloudBase', displayName: 'Cloud Base', category: 'clouds', type: 'numeric', unit: 'm', sortOrder: 15 },
      { name: 'cloudCeiling', displayName: 'Cloud Ceiling', category: 'clouds', type: 'numeric', unit: 'm', sortOrder: 16 },
      
      // Visibility & UV
      { name: 'visibility', displayName: 'Visibility', category: 'visibility', type: 'numeric', unit: 'km', sortOrder: 17 },
      { name: 'uvIndex', displayName: 'UV Index', category: 'visibility', type: 'numeric', unit: '', sortOrder: 18 },
      { name: 'uvHealthConcern', displayName: 'UV Health Concern', category: 'visibility', type: 'numeric', unit: '', sortOrder: 19 },
      
      // Weather
      { name: 'weatherCode', displayName: 'Weather Condition', category: 'weather', type: 'categorical', unit: '', sortOrder: 20 },
    ];

    await this.model.insertMany(parameters);
    console.log(`Seeded ${parameters.length} weather parameters`);
  }
}
