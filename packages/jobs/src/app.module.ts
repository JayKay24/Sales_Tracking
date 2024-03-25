import { Module } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';
import { ConfigService, ConfigModule } from '@nestjs/config';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { SalesModule } from './sales/sales.module';
import { QueuesModule } from './queues/queues.module';
import { EmailModule } from './email/email.module';
import { CommissionModule } from './commission/commission.module';
import { ScheduleModule } from '@nestjs/schedule';
import { TasksModule } from './tasks/tasks.module';
import { SaleSchema } from 'sales/sales.schema';
import { EmailService } from 'email/email.service';

@Module({
  imports: [
    ConfigModule.forRoot(),
    ScheduleModule.forRoot(),
    MongooseModule.forRootAsync({
      imports: [ConfigModule],
      useFactory: async (configService: ConfigService) => ({
        uri: configService.get<string>('JOBS_CONN_STR_LOCAL'),
      }),
      inject: [ConfigService],
    }),
    MongooseModule.forFeature([{ name: 'Sale', schema: SaleSchema }]),
    SalesModule,
    QueuesModule,
    EmailModule,
    CommissionModule,
    TasksModule,
  ],
  controllers: [AppController],
  providers: [AppService, EmailService],
})
export class AppModule {}
