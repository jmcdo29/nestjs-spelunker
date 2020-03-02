import { Test, TestingModule } from '@nestjs/testing';
import { HamstersController } from './hamsters.controller';

describe('Hamsters Controller', () => {
  let controller: HamstersController;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [HamstersController],
    }).compile();

    controller = module.get<HamstersController>(HamstersController);
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });
});
