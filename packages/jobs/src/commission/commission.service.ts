import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { Commission } from './commission.schema';

export const commissionRate = '3%';

@Injectable()
export class CommissionService {
  constructor(
    @InjectModel('Commission')
    private readonly commissionModel: Model<Commission>,
  ) {}

  async recordCommission(agentId: string, amount: number) {
    const [rate] = commissionRate.split('');
    const intRate = Number(rate);

    const latestCommision = this.calculateCommission(amount, intRate);
    const commision = new this.commissionModel({
      agent_id: agentId,
      latestCommision,
    });

    await commision.save();
  }

  async getUnPaidCommissions(agentId: string, howManyDaysAgo: Date) {
    const unpaidCommissions = await this.commissionModel
      .find({
        agent_id: agentId,
        createdAt: { $lte: howManyDaysAgo },
      })
      .exec();

    return unpaidCommissions.reduce(
      (accum, val) => accum + val.latestCommision,
      0,
    );
  }

  async getTotalCommissionsBetweenDates(
    agentId: string,
    startDate: Date,
    endDate: Date,
  ) {
    const commissions = await this.commissionModel
      .find({
        agent_id: agentId,
        createdAt: { $gte: startDate.getTime(), $lte: endDate.getTime() },
      })
      .exec();

    return commissions.reduce((accum, val) => accum + val.latestCommision, 0);
  }

  private calculateCommission(amount: number, rate: number) {
    return (rate / 100) * amount;
  }
}
