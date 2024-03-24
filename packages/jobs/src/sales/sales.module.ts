import { Module } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';
import { SaleSchema } from './sales.schema';
import { SalesService } from './sales.service';

@Module({
  imports: [MongooseModule.forFeature([{ name: 'Sale', schema: SaleSchema }])],
  providers: [SalesService],
})
export class SalesModule {}
