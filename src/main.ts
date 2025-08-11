import * as dotenv from 'dotenv';

// Load environment variables FIRST, before any other imports
dotenv.config();

import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { Logger, LogLevel } from '@nestjs/common';

console.log('🔍 Environment variables loaded:');
console.log('MONGODB_URI:', process.env.MONGODB_URI ? 'SET' : 'NOT SET');
console.log('MONGODB_URI value:', process.env.MONGODB_URI || 'UNDEFINED');

async function bootstrap() {
  // Configure logging based on environment
  const logLevels: LogLevel[] = process.env.NODE_ENV === 'production' 
    ? ['error', 'warn'] 
    : ['error', 'warn', 'log', 'debug', 'verbose'];

  const app = await NestFactory.create(AppModule, {
    logger: logLevels,
  });
  
  // Configure logging to write to files
  const logger = new Logger('Bootstrap');
  
  // You can also configure file logging here if needed
  // Example: Write logs to a file
  // const fs = require('fs');
  // const logStream = fs.createWriteStream('app.log', { flags: 'a' });
  // logger.log('Application started', 'Bootstrap');
  
  const port = process.env.PORT || 3001;
  await app.listen(port);
  logger.log(`Application is running on: http://localhost:${port}`);
  logger.log(`🗄️  MongoDB URI: ${process.env.MONGODB_URI ? 'Configured' : 'Not configured'}`);
}
bootstrap();
