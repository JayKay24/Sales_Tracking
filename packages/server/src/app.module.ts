import { Module } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { UserModule } from './user/user.module';
import { AuthModule } from './auth/auth.module';
import { ConfigService } from './config/config.service';

import * as dotenv from 'dotenv';

dotenv.config();

async function getConnString(configService: ConfigService) {
  const connString = await configService.getConnString();

  return { uri: connString };
}

@Module({
  imports: [
    MongooseModule.forRootAsync({
      useFactory: getConnString,
      inject: [ConfigService],
    }),
    UserModule,
    AuthModule,
  ],
  controllers: [AppController],
  providers: [AppService, ConfigService],
})
export class AppModule {}
