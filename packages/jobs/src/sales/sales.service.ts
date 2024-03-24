import { Injectable } from '@nestjs/common';
import { Model } from 'mongoose';
import { Sale } from './sales.schema';
import { InjectModel } from '@nestjs/mongoose';
import { SaleEvent } from 'queues/queues.service';

@Injectable()
export class SalesService {
  constructor(@InjectModel('Sale') private readonly saleModel: Model<Sale>) {}

  async recordSale(content: SaleEvent) {
    const newSale = new this.saleModel({
      price: content.price,
      product: content.product,
      agent: content.agent,
      agentId: content.agentId,
      customerId: content.customerId,
      customer: content.customer,
      agentEmail: content.agentEmail,
      customerEmail: content.customerEmail,
    });
    await newSale.save();
  }
}
