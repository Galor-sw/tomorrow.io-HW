import { Module } from '@nestjs/common';
import { MongooseModule as NestMongooseModule } from '@nestjs/mongoose';
import { MongooseModule } from './mongoose.module';
import { Alert, AlertSchema } from './schemas/alert.schema';
import { User, UserSchema } from './schemas/user.schema';
import { AlertsRepo } from './repos/alerts.repo';
import { UsersRepository } from './repos/users.repo';

@Module({
  imports: [
    MongooseModule,
    NestMongooseModule.forFeature([
      { name: Alert.name, schema: AlertSchema },
      { name: User.name, schema: UserSchema }
    ]),
  ],
  providers: [AlertsRepo, UsersRepository],
  exports: [AlertsRepo, UsersRepository],
})
export class DalModule {}
