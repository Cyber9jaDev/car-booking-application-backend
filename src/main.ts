import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import * as cookieParser from 'cookie-parser';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);
  app.enableCors({
    origin: process.env.FRONTEND_URL || 'http://localhost:3000',
    credentials: true // Important for cookies
  });
  app.setGlobalPrefix('api/v1');
  app.use(cookieParser());
  await app.listen(5000);
}
bootstrap();
