import { Module } from '@nestjs/common';
import { AnimalsController } from './animals.controller';
import { AnimalsService } from './animals.service';
import { CatsModule } from './cats/cats.module';
import { DogsModule } from './dogs/dogs.module';
import { HamstersModule } from './hamsters/hamsters.module';

@Module({
  imports: [CatsModule, DogsModule, HamstersModule],
  controllers: [AnimalsController],
  providers: [
    {
      provide: AnimalsService,
      useValue: new AnimalsService(),
    },
  ],
})
export class AnimalsModule {}
