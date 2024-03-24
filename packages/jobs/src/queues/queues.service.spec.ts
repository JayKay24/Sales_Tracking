import { Test, TestingModule } from '@nestjs/testing';
import { ConsumerQueuesService } from './queues.service';

describe('QueuesService', () => {
  let service: ConsumerQueuesService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [ConsumerQueuesService],
    }).compile();

    service = module.get<ConsumerQueuesService>(ConsumerQueuesService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });
});
