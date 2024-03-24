import { Module } from '@nestjs/common';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { ConsumerQueuesService } from './queues.service';
import { SalesService } from 'sales/sales.service';

@Module({
  imports: [ConfigModule.forRoot()],
  providers: [ConsumerQueuesService, SalesService, ConfigService],
})
export class QueuesModule {}
