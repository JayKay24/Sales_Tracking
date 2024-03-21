import { Module } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { extractVars } from './config';

async function getConnString() {
  const configs = await extractVars();

  return { uri: configs.db_conn_string };
}

@Module({
  imports: [
    MongooseModule.forRootAsync({
      useFactory: getConnString,
    }),
  ],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}
