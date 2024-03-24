import { Module } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';
import { ConfigService, ConfigModule } from '@nestjs/config';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { SalesModule } from './sales/sales.module';
import { QueuesModule } from './queues/queues.module';
import { EmailModule } from './email/email.module';
import { CommissionModule } from './commission/commission.module';

@Module({
  imports: [
    ConfigModule.forRoot(),
    MongooseModule.forRootAsync({
      imports: [ConfigModule],
      useFactory: async (configService: ConfigService) => ({
        uri: configService.get<string>('JOBS_CONN_STR_LOCAL'),
      }),
      inject: [ConfigService],
    }),
    SalesModule,
    QueuesModule,
    EmailModule,
    CommissionModule,
  ],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}
