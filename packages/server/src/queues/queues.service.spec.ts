import { Test, TestingModule } from '@nestjs/testing';
import { ProducerQueuesService } from './queues.service';

describe('QueuesService', () => {
  let service: ProducerQueuesService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [ProducerQueuesService],
    }).compile();

    service = module.get<ProducerQueuesService>(ProducerQueuesService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });
});
