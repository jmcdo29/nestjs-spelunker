import { Module } from '@nestjs/common';

import { DogsController } from './dogs.controller';
import { DogsService } from './dogs.service';

@Module({
  controllers: [DogsController],
  providers: [
    {
      provide: 'someString',
      useValue: 'something',
    },
    {
      provide: DogsService,
      useFactory: (_something: string) => new DogsService(),
      inject: ['someString'],
    },
  ],
  exports: [DogsService],
})
export class DogsModule {}
