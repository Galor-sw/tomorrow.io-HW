import { Module } from '@nestjs/common';
import { MongooseModule as NestMongooseModule } from '@nestjs/mongoose';
import { MongooseModule } from './mongoose.module';
import { Alert, AlertSchema } from './schemas/alert.schema';
import { AlertsRepo } from './repos/alerts.repo';

@Module({
  imports: [
    MongooseModule,
    NestMongooseModule.forFeature([{ name: Alert.name, schema: AlertSchema }]),
  ],
  providers: [AlertsRepo],
  exports: [AlertsRepo],
})
export class DalModule {}
