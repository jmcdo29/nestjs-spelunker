import { Module } from '@nestjs/common';
import { DogsModule } from './dogs/dogs.module';
import { CatsModule } from './cats/cats.module';
import { HamstersModule } from './hamsters/hamsters.module';

@Module({
  imports: [DogsModule, CatsModule, HamstersModule],
})
export class AnimalsModule {}
