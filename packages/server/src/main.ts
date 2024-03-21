import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import VARS_CONFIG from '../config';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);
  console.log('env vars here', VARS_CONFIG);
  await app.listen(4000);
}
bootstrap();
