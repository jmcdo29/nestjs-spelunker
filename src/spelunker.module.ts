import { INestApplicationContext, Type } from '@nestjs/common';

import { DebugModule } from './debug.module';
import { ExplorationModule } from './exploration.module';
import { DebuggedTree, SpelunkedTree } from './spelunker.interface';

export class SpelunkerModule {
  static explore(app: INestApplicationContext): SpelunkedTree[] {
    return ExplorationModule.explore(app);
  }

  static async debug(mod: Type<any>): Promise<DebuggedTree[]> {
    return DebugModule.debug(mod);
  }
}
