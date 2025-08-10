import * as dotenv from 'dotenv';

// Load environment variables FIRST, before any other imports
dotenv.config();

import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';

console.log('🔍 Environment variables loaded:');
console.log('MONGODB_URI:', process.env.MONGODB_URI ? 'SET' : 'NOT SET');
console.log('MONGODB_URI value:', process.env.MONGODB_URI || 'UNDEFINED');

async function bootstrap() {
  const app = await NestFactory.create(AppModule, {
    logger: ['log', 'error', 'warn'],
  });
  const port = process.env.PORT || 3001;
  await app.listen(port);
  console.log(`🚀 Application is running on: http://localhost:${port}`);
  console.log(`🗄️  MongoDB URI: ${process.env.MONGODB_URI ? 'Configured' : 'Not configured'}`);
}
bootstrap();
