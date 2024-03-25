import { Injectable, Logger, OnModuleInit } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import amqp, { ChannelWrapper } from 'amqp-connection-manager';
import { SalesService } from 'sales/sales.service';
import { ConfirmChannel } from 'amqplib';
import { EmailEvent, EmailService } from 'email/email.service';

export interface SaleEvent {
  price: number;
  product: string;
  agent: string;
  agentId: string;
  customerId: string;
  customer: string;
  agentEmail: string;
  customerEmail: string;
}

@Injectable()
export class ConsumerQueuesService implements OnModuleInit {
  private logger = new Logger(ConsumerQueuesService.name);
  private channelWrapper: ChannelWrapper;
  constructor(
    private salesService: SalesService,
    private configService: ConfigService,
  ) {
    const connection = amqp.connect([
      this.configService.get<string>('BROKER_URL'),
    ]);
    this.channelWrapper = connection.createChannel();
  }

  public async onModuleInit() {
    try {
      await this.channelWrapper.addSetup(async (channel: ConfirmChannel) => {
        await channel.assertQueue('salesQueue');
        await channel.assertQueue('emailsQueue');

        await channel.consume('salesQueue', async (message) => {
          if (message) {
            const content = JSON.parse(message.content.toString()) as SaleEvent;
            this.logger.log('message received', content);
            await this.salesService.recordSale(content);
            channel.ack(message);
          }
        });
        await channel.consume('emailsQueue', async (message) => {
          if (message) {
            const content = JSON.parse(message.content.toString()) as EmailEvent;
            this.logger.log('message received', content);
            await this.salesService.prepareNotifications(content);
            channel.ack(message);
          }
        });
      });
    } catch (error) {
      this.logger.log('Could not record sale');
    }
  }
}
