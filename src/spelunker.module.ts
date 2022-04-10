import { INestApplicationContext, Type } from '@nestjs/common';

import { DebugModule } from './debug.module';
import { ExplorationModule } from './exploration.module';
import { GraphingModule } from './graphing.module';
import {
  DebuggedTree,
  SpelunkedEdge,
  SpelunkedNode,
  SpelunkedTree,
} from './spelunker.interface';

export class SpelunkerModule {
  static explore(app: INestApplicationContext): SpelunkedTree[] {
    return ExplorationModule.explore(app);
  }

  static async debug(mod: Type<any>): Promise<DebuggedTree[]> {
    return DebugModule.debug(mod);
  }

  static graph(tree: SpelunkedTree[]): SpelunkedNode {
    return GraphingModule.graph(tree);
  }

  static findGraphEdges(root: SpelunkedNode): SpelunkedEdge[] {
    return GraphingModule.getEdges(root);
  }
}
