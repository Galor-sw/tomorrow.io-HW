import { Body, Controller, Get, Post, Param, UsePipes, ValidationPipe, HttpException, HttpStatus } from '@nestjs/common';
import { AlertsService } from './alerts.service';
import { CreateAlertDto } from './dtos/create-alert.dto';

@Controller('api')
export class AlertsController {
  constructor(private readonly alertsService: AlertsService) {}

  @Get('alerts')
  findAll() {
    return this.alertsService.findAll();
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
          message: error.message,
          error: 'Not Found'
        }, HttpStatus.NOT_FOUND);
      }
      
      // Handle invalid location errors
      if (error.message.includes('Invalid location name')) {
        throw new HttpException({
          statusCode: HttpStatus.BAD_REQUEST,
          message: error.message,
          error: 'Bad Request'
        }, HttpStatus.BAD_REQUEST);
      }
      
      // Handle other weather API errors
      if (error.message.includes('Weather API error')) {
        throw new HttpException({
          statusCode: HttpStatus.BAD_GATEWAY,
          message: error.message,
          error: 'Bad Gateway'
        }, HttpStatus.BAD_GATEWAY);
      }
      
      // Handle other errors
      throw new HttpException({
        statusCode: HttpStatus.INTERNAL_SERVER_ERROR,
        message: 'Internal server error',
        error: 'Internal Server Error'
      }, HttpStatus.INTERNAL_SERVER_ERROR);
    }
  }

  // Weather endpoint - goes through API Gateway
  @Get('weather/:location')
  async getWeatherData(@Param('location') location: string) {
    try {
      return await this.alertsService.getWeatherData(location);
    } catch (error) {
      // Handle invalid location errors
      if (error.message.includes('Invalid location name')) {
        throw new HttpException({
          statusCode: HttpStatus.BAD_REQUEST,
          message: error.message,
          error: 'Bad Request'
        }, HttpStatus.BAD_REQUEST);
      }
      
      // Handle other weather API errors
      if (error.message.includes('Weather API error')) {
        throw new HttpException({
          statusCode: HttpStatus.BAD_GATEWAY,
          message: error.message,
          error: 'Bad Gateway'
        }, HttpStatus.BAD_GATEWAY);
      }
      
      // Handle other errors
      throw new HttpException({
        statusCode: HttpStatus.INTERNAL_SERVER_ERROR,
        message: 'Internal server error',
        error: 'Internal Server Error'
      }, HttpStatus.INTERNAL_SERVER_ERROR);
    }
  }
}
