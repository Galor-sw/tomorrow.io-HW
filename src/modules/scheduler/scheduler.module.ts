import { Module } from '@nestjs/common';
import { SchedulerService } from './scheduler.service';
import { DalModule } from '../dal/dal.module';
import { WeatherModule } from '../weather/weather.module';
import { NotifierModule } from '../notifier/notifier.module';

@Module({
  imports: [DalModule, WeatherModule, NotifierModule],
  providers: [SchedulerService],
})
export class SchedulerModule {}
