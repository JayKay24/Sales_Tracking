import { Module } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';
import { SaleSchema } from './sales.schema';
import { SalesService } from './sales.service';
import { CommissionService } from 'commission/commission.service';
import { CommissionSchema } from 'commission/commission.schema';

@Module({
  imports: [MongooseModule.forFeature([{ name: 'Sale', schema: SaleSchema }, { name: 'Commission', schema: CommissionSchema }])],
  providers: [SalesService, CommissionService],
})
export class SalesModule {}
