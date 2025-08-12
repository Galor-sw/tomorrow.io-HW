import { Module } from '@nestjs/common';
import { MongooseModule as NestMongooseModule } from '@nestjs/mongoose';

@Module({
  imports: [
    NestMongooseModule.forRoot(
      process.env.MONGODB_URI,
    ),
  ],
  exports: [NestMongooseModule],
})
export class MongooseModule {}
