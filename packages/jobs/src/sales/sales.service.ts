import { Injectable } from '@nestjs/common';
import { Model } from 'mongoose';
import { Sale, SaleDocument } from './sales.schema';
import { InjectModel } from '@nestjs/mongoose';
import { SaleEvent } from 'queues/queues.service';
import {
  CommissionService,
  commissionRate,
} from 'commission/commission.service';
import { EmailEvent, EmailService } from 'email/email.service';

@Injectable()
export class SalesService {
  constructor(
    @InjectModel('Sale') private readonly saleModel: Model<Sale>,
    private commissionService: CommissionService,
    private emailService: EmailService,
  ) {}

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
    await this.commissionService.recordCommission(
      newSale.agent_id,
      newSale.price,
    );
  }

  async getTotalSales(
    agentId: string,
    startDate: Date,
    endDate: Date,
  ): Promise<[SaleDocument[], number]> {
    const sales: SaleDocument[] = await this.saleModel
      .find({
        agent_id: agentId,
        createdAt: { $gte: startDate, $lte: endDate },
      })
      .exec();
    return [sales, sales.reduce((accum, val) => accum + val.price, 0)];
  }

  async prepareNotifications(content: EmailEvent) {
    const agentIds = content.agentIds.split('\n');
    agentIds.forEach(async (agentId) => {
      const [sales, totalSales] = await this.getTotalSales(
        agentId,
        new Date(content.startDate),
        new Date(content.endDate),
      );
      if (sales.length > 0) {
        const email = sales[0].agent_email;
        const totalCommission =
          await this.commissionService.getTotalCommissionsBetweenDates(
            agentId,
            new Date(content.startDate),
            new Date(content.endDate),
          );

        await this.emailService.sendEmail(
          email,
          `Sales between ${content.startDate} and ${content.endDate}`,
          content.message +
            `\nTotal Sales: ${totalSales}\nTotal Commission: ${totalCommission}`,
        );
      }
    });
  }
}
