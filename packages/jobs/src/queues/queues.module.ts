import { Module } from '@nestjs/common';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { ConsumerQueuesService } from './queues.service';
import { SalesService } from 'sales/sales.service';
import { MongooseModule } from '@nestjs/mongoose';
import { SaleSchema } from 'sales/sales.schema';

@Module({
  imports: [
    ConfigModule.forRoot(),
    MongooseModule.forFeature([{ name: 'Sale', schema: SaleSchema }]),
  ],
  providers: [ConsumerQueuesService, SalesService, ConfigService],
})
export class QueuesModule {}
