import { Injectable } from '@nestjs/common';
import { Cron, CronExpression } from '@nestjs/schedule';

@Injectable()
export class SchedulerService {
  @Cron(CronExpression.EVERY_5_MINUTES)
  handleCron() {
    console.log('Scheduler running every 5 minutes...');
  }
}
