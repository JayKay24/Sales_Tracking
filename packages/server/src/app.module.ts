import { Module } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';
import { ConfigService, ConfigModule } from '@nestjs/config';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { UserModule } from './user/user.module';
import { AuthModule } from './auth/auth.module';
import { ProductModule } from './product/product.module';
import { QueuesModule } from './queues/queues.module';

async function getDbConnString(configService: ConfigService) {
  const env = configService.get<string>('NODE_ENV');
  if (env === 'production') {
    return { uri: configService.get<string>('CONN_STR_PROD') };
  }
  return { uri: configService.get<string>('CONN_STR_LOCAL') };
}

@Module({
  imports: [
    ConfigModule.forRoot(),
    MongooseModule.forRootAsync({
      imports: [ConfigModule],
      useFactory: getDbConnString,
      inject: [ConfigService],
    }),
    UserModule,
    AuthModule,
    ProductModule,
    QueuesModule,
  ],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}
