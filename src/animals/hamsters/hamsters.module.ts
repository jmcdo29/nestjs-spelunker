import { Module } from '@nestjs/common';
import { HamstersController } from './hamsters.controller';
import { HamstersService } from './hamsters.service';

@Module({
  controllers: [HamstersController],
  providers: [
    {
      provide: HamstersService,
      useFactory: () => new HamstersService(),
      // useClass: HamstersService,
      // useValue: new HamstersService(),
    },
  ],
})
export class HamstersModule {}
