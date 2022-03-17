import { forwardRef, Module } from '@nestjs/common';

import { BarService } from './bar.service';
import { FooModule } from './foo.module';

@Module({
  imports: [forwardRef(() => FooModule)],
  providers: [BarService],
  exports: [BarService],
})
export class BarModule {}
