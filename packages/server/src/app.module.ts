import { Module } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { UserModule } from './user/user.module';
import { AuthModule } from './auth/auth.module';

import * as dotenv from 'dotenv';
import { extractVars } from 'config';

dotenv.config();

async function getConnString() {
  const configs = await extractVars();

  return { uri: configs.db_conn_string };
}

@Module({
  imports: [
    MongooseModule.forRootAsync({ useFactory: getConnString }),
    UserModule,
    AuthModule,
  ],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}
