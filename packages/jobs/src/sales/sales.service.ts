import { Injectable } from '@nestjs/common';
import { Model } from 'mongoose';
import { Sale } from './sales.schema';
import { InjectModel } from '@nestjs/mongoose';
import { SaleEvent } from 'queues/queues.service';
import { CommissionService, commissionRate } from 'commission/commission.service';

@Injectable()
export class SalesService {
  constructor(@InjectModel('Sale') private readonly saleModel: Model<Sale>, 
  private commissionService: CommissionService) {}

  async recordSale(content: SaleEvent) {
    const newSale = new this.saleModel({
      price: content.price,
      product: content.product,
      agent: content.agent,
      agent_id: content.agentId,
      customer_id: content.customerId,
      customer: content.customer,
      agent_email: content.agentEmail,
      customer_email: content.customerEmail,
      commission_rate: commissionRate,
    });
    await newSale.save();
    await this.commissionService.recordCommission(newSale.agent_id, newSale.price);
  }

  async getTotalSales(agentId: string, startDate: Date, endDate: Date) {
    const sales = await this.saleModel
      .find({
        agent_id: agentId,
        createdAt: { $gte: startDate.getTime(), $lte: endDate.getTime() },
      })
      .exec();
    return [sales, sales.reduce((accum, val) => accum + val.price, 0)];
  }
}
