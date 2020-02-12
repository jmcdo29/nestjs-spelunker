import { Test, TestingModule } from '@nestjs/testing';
import { DogsController } from './dogs.controller';

describe('Dogs Controller', () => {
  let controller: DogsController;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [DogsController],
    }).compile();

    controller = module.get<DogsController>(DogsController);
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });
});
