import { HttpException, HttpStatus, Injectable } from '@nestjs/common';
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
      throw new HttpException(
        'Error adding sale to queue',
        HttpStatus.INTERNAL_SERVER_ERROR,
      );
    }
  }
}
