import { Body, Controller, Get, Post, Param, Delete, UsePipes, ValidationPipe, HttpException, HttpStatus } from '@nestjs/common';
import { AlertsService } from './alerts.service';
import { CreateAlertDto } from './dtos/create-alert.dto';
import { DeleteAlertDto } from './dtos/delete-alert.dto';

@Controller('api')
export class AlertsController {
  constructor(private readonly alertsService: AlertsService) {}

  @Get('alerts')
  findAll() {
    return this.alertsService.findAll();
  }

  @Get('alerts/:id')
  findById(@Param('id') id: string) {
    return this.alertsService.findById(id);
  }

  @Post('alerts')
  @UsePipes(new ValidationPipe({ whitelist: true, transform: true }))
  async create(@Body() dto: CreateAlertDto) {
    try {
      // NOTE: For 'weatherCode' comparisons, '=' / '!=' are most meaningful; other operators will be treated numerically at evaluation time.
      return await this.alertsService.create(dto);
    } catch (error) {
      // Handle user not found errors
      if (error.message.includes('not found')) {
        throw new HttpException({
          statusCode: HttpStatus.NOT_FOUND,
          error: 'Not Found',
          message: error.message,
        }, HttpStatus.NOT_FOUND);
      }

      // Handle validation errors
      if (error.message.includes('Invalid parameter') || error.message.includes('Invalid location name')) {
        throw new HttpException({
          statusCode: HttpStatus.BAD_REQUEST,
          error: 'Bad Request',
          message: error.message,
        }, HttpStatus.BAD_REQUEST);
      }

      // Handle other errors
      throw new HttpException({
        statusCode: HttpStatus.INTERNAL_SERVER_ERROR,
        error: 'Internal Server Error',
        message: 'An unexpected error occurred',
      }, HttpStatus.INTERNAL_SERVER_ERROR);
    }
  }

  @Delete('alerts')
  @UsePipes(new ValidationPipe({ whitelist: true, transform: true }))
  async delete(@Body() dto: DeleteAlertDto) {
    try {
      return await this.alertsService.delete(dto._id);
    } catch (error) {
      if (error.message.includes('not found')) {
        throw new HttpException({
          statusCode: HttpStatus.NOT_FOUND,
          error: 'Not Found',
          message: error.message,
        }, HttpStatus.NOT_FOUND);
      }

      throw new HttpException({
        statusCode: HttpStatus.INTERNAL_SERVER_ERROR,
        error: 'Internal Server Error',
        message: 'An unexpected error occurred',
      }, HttpStatus.INTERNAL_SERVER_ERROR);
    }
  }

  @Get('weather/:location')
  getWeatherData(@Param('location') location: string) {
    return this.alertsService.getWeatherData(location);
  }
}
