import { Module } from '@nestjs/common';
import { OgmaModule } from '@ogma/nestjs-module';

import { AnimalsModule } from './animals/animals.module';

@Module({
  imports: [
    AnimalsModule,
    OgmaModule.forRoot({
      interceptor: false,
    }),
  ],
})
export class AppModule {}
