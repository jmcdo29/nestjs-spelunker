import { Test, TestingModule } from '@nestjs/testing';
import { HamstersService } from './hamsters.service';

describe('HamstersService', () => {
  let service: HamstersService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [HamstersService],
    }).compile();

    service = module.get<HamstersService>(HamstersService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });
});
