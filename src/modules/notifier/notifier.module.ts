import { Module } from '@nestjs/common';
import { NotifierService } from './notifier.service';
import { DalModule } from '../dal/dal.module';

@Module({
  imports: [DalModule],
  providers: [NotifierService],
  exports: [NotifierService],
})
export class NotifierModule {}
