import { NestFactory } from '@nestjs/core';
import { FastifyAdapter } from '@nestjs/platform-fastify';
import { ZodValidationPipe } from '@project/zod-nestjs';
import { AppModule } from './app.module';

async function bootstrap() {
  const app = await NestFactory.create(AppModule, new FastifyAdapter());
  app.useGlobalPipes(new ZodValidationPipe());
  await app.listen(3000, '0.0.0.0');
}
bootstrap();
