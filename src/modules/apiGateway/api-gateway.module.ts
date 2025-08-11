import { Module } from '@nestjs/common';
import { AlertsController } from './alerts.controller';
import { AlertsService } from './alerts.service';
import { UsersController } from './users.controller';
import { UsersService } from './users.service';
import { ParametersController } from './parameters.controller';
import { ParametersService } from './parameters.service';
import { TriggeredAlertsController } from './triggered-alerts.controller';
import { TriggeredAlertsService } from './triggered-alerts.service';
import { DalModule } from '../dal/dal.module';
import { WeatherModule } from '../weather/weather.module';

@Module({
  imports: [DalModule, WeatherModule],
  controllers: [AlertsController, UsersController, ParametersController, TriggeredAlertsController],
  providers: [AlertsService, UsersService, ParametersService, TriggeredAlertsService],
})
export class ApiGatewayModule {}
