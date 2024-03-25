import { Module } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { ProducerQueuesService } from './queues.service';

@Module({
  providers: [ProducerQueuesService, ConfigService],
})
export class QueuesModule {}
