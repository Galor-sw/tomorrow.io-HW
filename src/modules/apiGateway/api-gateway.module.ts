import { Module } from '@nestjs/common';
import { AlertsController } from './alerts.controller';
import { AlertsService } from './alerts.service';
import { UsersController } from './users.controller';
import { UsersService } from './users.service';
import { DalModule } from '../dal/dal.module';
import { WeatherModule } from '../weather/weather.module';

@Module({
  imports: [DalModule, WeatherModule],
  controllers: [AlertsController, UsersController],
  providers: [AlertsService, UsersService],
})
export class ApiGatewayModule {}
