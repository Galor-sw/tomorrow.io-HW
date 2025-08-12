import * as dotenv from 'dotenv';

// Load environment variables FIRST, before any other imports
dotenv.config();

import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { Logger, LogLevel } from '@nestjs/common';


async function bootstrap() {
  // Configure logging based on environment
  const logLevels: LogLevel[] = process.env.NODE_ENV === 'production' 
    ? ['error', 'warn'] 
    : ['error', 'warn', 'log', 'debug', 'verbose'];

  const app = await NestFactory.create(AppModule, {
    logger: logLevels,
  });
  
  // Configure CORS to allow requests from React frontend
  app.enableCors({
    origin: ['http://localhost:3000', 'http://127.0.0.1:3000'], // React dev server
    methods: ['GET', 'POST', 'PUT', 'DELETE', 'PATCH', 'OPTIONS'],
    allowedHeaders: ['Content-Type', 'Authorization'],
    credentials: true,
  });
  
  // Configure logging to write to files
  const logger = new Logger('Bootstrap');

  
  const port = process.env.PORT || 3001;
  await app.listen(port);
  logger.log(`Application is running on: http://localhost:${port}`);
  logger.log(`🗄️  MongoDB URI: ${process.env.MONGODB_URI ? 'Configured' : 'Not configured'}`);
  logger.log(`🌐 CORS enabled for React frontend (http://localhost:3000)`);
}
bootstrap();
