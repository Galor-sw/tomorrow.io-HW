import { Module } from '@nestjs/common';
import { MongooseModule as NestMongooseModule } from '@nestjs/mongoose';
import { MongooseModule } from './mongoose.module';
import { Alert, AlertSchema } from './schemas/alert.schema';
import { User, UserSchema } from './schemas/user.schema';
import { TriggeredAlert, TriggeredAlertSchema } from './schemas/triggered-alert.schema';
import { Parameter, ParameterSchema } from './schemas/parameter.schema';
import { AlertsRepo } from './repos/alerts.repo';
import { UsersRepository } from './repos/users.repo';
import { TriggeredAlertsRepo } from './repos/triggered.repo';
import { ParametersRepo } from './repos/parameters.repo';

@Module({
  imports: [
    MongooseModule,
    NestMongooseModule.forFeature([
      { name: Alert.name, schema: AlertSchema },
      { name: User.name, schema: UserSchema },
      { name: TriggeredAlert.name, schema: TriggeredAlertSchema },
      { name: Parameter.name, schema: ParameterSchema }
    ]),
  ],
  providers: [AlertsRepo, UsersRepository, TriggeredAlertsRepo, ParametersRepo],
  exports: [AlertsRepo, UsersRepository, TriggeredAlertsRepo, ParametersRepo],
})
export class DalModule {}
