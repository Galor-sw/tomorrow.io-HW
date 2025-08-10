import { Module } from '@nestjs/common';
import { ScheduleModule } from '@nestjs/schedule';
import { ApiGatewayModule } from './modules/apiGateway/api-gateway.module';
import { SchedulerModule } from './modules/scheduler/scheduler.module';
import { NotifierModule } from './modules/notifier/notifier.module';
import { WeatherModule } from './modules/weather/weather.module';
import { DalModule } from './modules/dal/dal.module';

@Module({
  imports: [
    ScheduleModule.forRoot(),
    DalModule,
    ApiGatewayModule,
    SchedulerModule,
    NotifierModule,
    WeatherModule,
  ],
})
export class AppModule {}
