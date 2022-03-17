import { Module } from '@nestjs/common';

import { BarModule } from './bar.module';
import { FooModule } from './foo.module';

@Module({
  imports: [FooModule, BarModule],
})
export class AppModule {}
