import { Injectable, OnModuleInit } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import amqp, { ChannelWrapper } from 'amqp-connection-manager';
import { SalesService } from 'sales/sales.service';
import { ConfirmChannel } from 'amqplib';

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
        await channel.consume('salesQueue', async (message) => {
          if (message) {
            const content = JSON.parse(message.content.toString()) as SaleEvent;
            await this.salesService.recordSale(content);
            channel.ack(message);
          }
        });
      });
    } catch (error) {
      console.log('Error starting the consumer');
      process.exit(1);
    }
  }
}
