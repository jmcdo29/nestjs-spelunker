import { Module } from '@nestjs/common';
import { DogsController } from './dogs.controller';
import { DogsService } from './dogs.service';

@Module({
  controllers: [DogsController],
  providers: [
    {
      provide: DogsService,
      useFactory: () => new DogsService(),
    },
  ],
})
export class DogsModule {}
