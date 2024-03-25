import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { ValidationPipe } from '@nestjs/common';
import { DocumentBuilder, SwaggerModule } from '@nestjs/swagger';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);

  app.useGlobalPipes(new ValidationPipe({ whitelist: true }));

  const config = new DocumentBuilder()
    .setTitle('Sales Tracking System')
    .setDescription(
      `comprehensive sales
  tracking system that enables sales agents to record sales, calculate
  commissions, and receive email notifications containing statements of their
  sales within a requested period.`,
    )
    .setVersion('1.0')
    .addTag('auth')
    .addTag('users')
    .addTag('products')
    .build();

  const document = SwaggerModule.createDocument(app, config);

  SwaggerModule.setup('api/v1/docs', app, document);
  app.enableCors();

  await app.listen(4000);
}
bootstrap();
