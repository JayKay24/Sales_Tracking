import { Module } from '@nestjs/common';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { ConsumerQueuesService } from './queues.service';
import { SalesService } from 'sales/sales.service';
import { MongooseModule } from '@nestjs/mongoose';
import { SaleSchema } from 'sales/sales.schema';
import { CommissionService } from 'commission/commission.service';
import { CommissionSchema } from 'commission/commission.schema';

@Module({
  imports: [
    ConfigModule.forRoot(),
    MongooseModule.forFeature([{ name: 'Sale', schema: SaleSchema }, { name: 'Commission', schema: CommissionSchema }]),
  ],
  providers: [ConsumerQueuesService, SalesService, ConfigService, CommissionService],
})
export class QueuesModule {}
