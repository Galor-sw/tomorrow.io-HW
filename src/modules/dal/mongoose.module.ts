import { Module } from '@nestjs/common';
import { MongooseModule as NestMongooseModule } from '@nestjs/mongoose';

console.log('🔧 MongooseModule - MONGODB_URI:', process.env.MONGODB_URI ? 'SET' : 'NOT SET');
console.log('🔧 MongooseModule - MONGODB_URI value:', process.env.MONGODB_URI || 'UNDEFINED');

@Module({
  imports: [
    NestMongooseModule.forRoot(
      process.env.MONGODB_URI,
    ),
  ],
  exports: [NestMongooseModule],
})
export class MongooseModule {}
