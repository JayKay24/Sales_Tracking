import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { extractVars } from '../config';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);
  extractVars().then((content) => {
    console.log('env vars here', content);
  });
  await app.listen(4000);
}
bootstrap();
