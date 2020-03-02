import { Module } from '@nestjs/common';
import { AnimalsModule } from './animals/animals.module';

@Module({
  imports: [AnimalsModule],
})
export class AppModule {}
