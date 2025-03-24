import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import * as cookieParser from 'cookie-parser';
import { ValidationPipe } from '@nestjs/common';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);
  app.enableCors({
    // origin: 'http://localhost:3000',
    // credentials: true, // Important for cookies
    // exposedHeaders: ['Set-Cookie'], // Add this line
    origin: [
      'http://127.0.0.1:3000/',
      'http://localhost:3000/',
      'http://127.0.0.1:3000',
      'http://localhost:3000',
      'https://127.0.0.1:3000/',
      'https://localhost:3000/',
      'https://127.0.0.1:3000',
      'https://localhost:3000',
    ],
    methods: ['GET', 'HEAD', 'PUT', 'PATCH', 'POST', 'DELETE'],
    credentials: true,
  });
  app.use(cookieParser());
  app.useGlobalPipes(
    new ValidationPipe({
      whitelist: true,
      transform: true,
      transformOptions: {
        enableImplicitConversion: true,
      },
    }),
  );
  app.setGlobalPrefix('api/v1');
  await app.listen(5000);
}
bootstrap();
