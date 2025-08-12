import { Module, Logger } from '@nestjs/common';
import { MongooseModule as NestMongooseModule } from '@nestjs/mongoose';

@Module({
  imports: [
    NestMongooseModule.forRoot(
      process.env.MONGODB_URI,
      {
        connectionFactory: (connection) => {
          const logger = new Logger('MongooseModule');
          
          connection.on('connected', () => {
            logger.log('✅ MongoDB connected successfully');
          });
          
          connection.on('error', (error) => {
            logger.error('❌ MongoDB connection error:', error);
          });
          
          connection.on('disconnected', () => {
            logger.warn('⚠️  MongoDB disconnected');
          });
          
          return connection;
        }
      }
    ),
  ],
  exports: [NestMongooseModule],
})
export class MongooseModule {}
