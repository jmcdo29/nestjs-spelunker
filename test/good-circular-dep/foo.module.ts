import { forwardRef, Module } from '@nestjs/common';

import { BarModule } from './bar.module';
import { FooService } from './foo.service';

@Module({
  imports: [forwardRef(() => BarModule)],
  providers: [FooService],
  exports: [FooService],
})
export class FooModule {}
