import { Module } from '@nestjs/common';
import { CatsController } from './cats.controller';
import { CatsService } from './cats.service';

@Module({
  controllers: [CatsController],
  providers: [
    {
      provide: CatsService.name,
      useClass: CatsService,
    },
  ],
})
export class CatsModule {}
