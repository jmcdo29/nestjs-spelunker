import { Module } from '@nestjs/common';
import { HamstersController } from './hamsters.controller';
import { HamstersService } from './hamsters.service';

@Module({
  controllers: [HamstersController],
  providers: [HamstersService],
})
export class HamstersModule {}
