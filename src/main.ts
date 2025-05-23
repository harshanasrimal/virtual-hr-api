import "./instrument";

import { ValidationPipe } from '@nestjs/common';
import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { SentryExceptionFilter } from './sentry-exception.filter';
import { TransformDateInterceptor } from "./core/intercepter/transform-date.interceptor";
import * as express from 'express';
import { join } from 'path';


async function bootstrap() {
  const app = await NestFactory.create(AppModule);

  app.use('/uploads', express.static(join(__dirname, '..', 'uploads')));

  app.useGlobalFilters(new SentryExceptionFilter());

  app.useGlobalInterceptors(new TransformDateInterceptor());


  app.useGlobalPipes(
    new ValidationPipe({
      whitelist: true, // Strip properties that are not in the DTO
      forbidNonWhitelisted: true, // Throw an error if non-whitelisted properties are provided
      transform: true, // Automatically transform payloads to DTO instances
    }),
  );
  app.enableCors({
    origin: ['https://hr.harshanasrimal.com'],
    methods: ['GET', 'POST', 'PUT', 'DELETE', 'OPTIONS'],
    credentials: true,
  });

  await app.listen(process.env.PORT ?? 3000);
}
bootstrap();
