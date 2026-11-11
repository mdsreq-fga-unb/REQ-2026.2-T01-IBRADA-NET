import { ValidationPipe } from '@nestjs/common';
import { NestFactory } from '@nestjs/core';
import { AppModule, ObserveInstrument } from './app.module.js';

async function bootstrap() {
  const app = await NestFactory.create(AppModule, {
    instrument: ObserveInstrument,
  });

  // Sem este pipe os decorators do class-validator (DTOs) não rodam.
  // whitelist + forbidNonWhitelisted: campo fora do DTO (ex.: role no PATCH) vira 400.
  app.useGlobalPipes(
    new ValidationPipe({ whitelist: true, forbidNonWhitelisted: true, transform: true }),
  );

  // O front (outra origem) chama a API com o header Authorization.
  app.enableCors({ origin: process.env.FRONTEND_URL ?? 'http://localhost:3000' });

  await app.listen(process.env.PORT ?? 3000);
}
await bootstrap();
