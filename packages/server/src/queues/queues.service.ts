import { Injectable, InternalServerErrorException } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import amqp, { ChannelWrapper } from 'amqp-connection-manager';
import { Channel } from 'amqplib';

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

export interface EmailEvent {
  agentIds: string;
  message: string;
  startDate: Date;
  endDate: Date;
}

@Injectable()
export class ProducerQueuesService {
  private channelWrapper: ChannelWrapper;
  constructor(private configService: ConfigService) {
    const connection = amqp.connect([
      this.configService.get<string>('BROKER_URL'),
    ]);
    this.channelWrapper = connection.createChannel({
      setup: (channel: Channel) => {
        return channel.assertQueue('salesQueue');
      },
    });
  }

  async addToSalesQueue(sale: SaleEvent) {
    try {
      await this.channelWrapper.sendToQueue(
        'salesQueue',
        Buffer.from(JSON.stringify(sale)),
      );
    } catch (error) {
      throw new InternalServerErrorException('Could not record sale');
    }
  }

  async notifyAgents(
    recipients: string[],
    message: string,
    startDate: Date,
    endDate: Date,
  ) {
    const recipientsString = recipients.join('\n');
    const emailEvent: EmailEvent = {
      agentIds: recipientsString,
      message,
      startDate,
      endDate,
    };
    try {
      await this.channelWrapper.sendToQueue(
        'emailsQueue',
        Buffer.from(JSON.stringify(emailEvent)),
      );
    } catch (error) {
      throw new InternalServerErrorException('Could not notify recipients');
    }
  }
}
