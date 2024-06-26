import { Injectable, Logger } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Cron } from '@nestjs/schedule';
import { CommissionService } from 'commission/commission.service';
import { EmailService } from 'email/email.service';
import { Model } from 'mongoose';
import { Sale } from 'sales/sales.schema';

@Injectable()
export class TasksService {
  private logger = new Logger(TasksService.name);
  constructor(
    @InjectModel('Sale') private salesModel: Model<Sale>,
    private emailService: EmailService,
    private commissionService: CommissionService,
  ) {}

  @Cron('0 0 0 */15 * *') // run evey 15 days
  async handleCron() {
    this.logger.log('Run cron job to send emails to agents every 15 days');
    const agentIds = await this.salesModel.distinct('agent_id').exec();
    const today = new Date();
    const fifteenDaysAgo = new Date(today.getTime() - 15 * 24 * 60 * 60);

    agentIds.forEach(async (id) => {
      const unpaidCommissions =
        await this.commissionService.getUnPaidCommissions(id, fifteenDaysAgo);
      const agent = await this.salesModel.findOne({ agent_id: id }).exec();
      await this.emailService.sendEmail(
        agent.agent_email,
        'Your total unpaid commissions so far',
        `Here's your total unpaid commissions since 15 days ago, \nTotal unpaid: ${unpaidCommissions}`,
      );
    });
  }
}
