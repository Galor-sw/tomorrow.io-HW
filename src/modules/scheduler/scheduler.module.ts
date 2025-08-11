import { Module } from '@nestjs/common';
import { SchedulerService } from './scheduler.service';
import { DalModule } from '../dal/dal.module';
import { WeatherModule } from '../weather/weather.module';

@Module({
  imports: [DalModule, WeatherModule],
  providers: [SchedulerService],
})
export class SchedulerModule {}
