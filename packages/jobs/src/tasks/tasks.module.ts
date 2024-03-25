import { Module } from '@nestjs/common';
import { TasksService } from './tasks.service';
import { EmailService } from 'email/email.service';
import { SalesService } from 'sales/sales.service';
import { MongooseModule } from '@nestjs/mongoose';
import { SaleSchema } from 'sales/sales.schema';
import { CommissionSchema } from 'commission/commission.schema';
import { CommissionService } from 'commission/commission.service';
import { ConfigService } from '@nestjs/config';

@Module({
  imports: [
    MongooseModule.forFeature([
      { name: 'Sale', schema: SaleSchema },
      { name: 'Commission', schema: CommissionSchema },
    ]),
  ],
  providers: [
    TasksService,
    EmailService,
    SalesService,
    CommissionService,
    ConfigService,
  ],
})
export class TasksModule {}
