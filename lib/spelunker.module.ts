import { INestApplicationContext, Type } from '@nestjs/common';
import { DebugModule } from './debug.module';
import { ExplorationModule } from './exploration.module';
import { SpelunkedTree, DebuggedTree } from './spelunker.interface';

export class SpelunkerModule {
  static explore(app: INestApplicationContext): SpelunkedTree[] {
    return ExplorationModule.explore(app);
  }

  static debug(mod: Type<any>): DebuggedTree[] {
    return DebugModule.debug(mod);
  }
}
