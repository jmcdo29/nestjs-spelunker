import { INestApplication } from '@nestjs/common';
import { NestFactory } from '@nestjs/core';
import { dequal } from 'dequal';
import { suite } from 'uvu';
import { equal, is } from 'uvu/assert';

import { SpelunkerModule } from '../../src/';
import {
  cyclicGraphEdgesOutput,
  debugOutput,
  exploreOutput,
  graphEdgesOutput,
} from '../fixtures/output';
import { AppModule } from './app.module';

export const SpelunkerSuite = suite<{ app: INestApplication }>(
  'SpelunkerSuite',
);

SpelunkerSuite.before(async (context) => {
  context.app = await NestFactory.create(AppModule, { logger: false });
});
SpelunkerSuite.after(async ({ app }) => app.close());

SpelunkerSuite('Should allow the spelunkerModule to explore', ({ app }) => {
  const output = SpelunkerModule.explore(app);
  exploreOutput.forEach((expected) => {
    is(
      output.some((outputPart) => {
        return dequal(outputPart, expected);
      }),
      true,
    );
  });
});

SpelunkerSuite('Should allow the SpelunkerModule to debug', async () => {
  const output = await SpelunkerModule.debug(AppModule);
  equal(output, debugOutput);
});

SpelunkerSuite('Should allow the SpelunkerModule to graph', ({ app }) => {
  const tree = SpelunkerModule.explore(app);
  const root = SpelunkerModule.graph(tree);
  const edges = SpelunkerModule.findGraphEdges(root);
  equal(
    edges.map((e) => `${e.from.module.name}-->${e.to.module.name}`),
    graphEdgesOutput,
  );
});

SpelunkerSuite(
  'Should handle a module circular dependency when finding graph edges',
  ({ app }) => {
    const tree = SpelunkerModule.explore(app);
    tree.slice(-1)[0].imports.push('AppModule');
    const root = SpelunkerModule.graph(tree);
    const edges = SpelunkerModule.findGraphEdges(root);
    equal(
      edges.map((e) => `${e.from.module.name}-->${e.to.module.name}`),
      cyclicGraphEdgesOutput,
    );
  },
);

SpelunkerSuite(
  'Should exclude modules according to the `ignoreImports` option',
  ({ app }) => {
    const emptyTree = SpelunkerModule.explore(app, {
      ignoreImports: [
        // for type-sake coverage only
        /^this_will_not_pass$/,
        // for type-sake coverage only
        (moduleName) => moduleName.startsWith('this_will_not_pass_either'),
        // excluding everything
        /.+/,
      ],
    });
    equal(emptyTree.length, 0);

    const nonEmptyTree = SpelunkerModule.explore(app, {
      ignoreImports: [(moduleName) => moduleName.includes('Core')],
    });
    equal(nonEmptyTree.map((module) => module.name).sort(), [
      'AnimalsModule',
      'AppModule',
      'CatsModule',
      'DogsModule',
      'HamstersModule',
    ]);
  },
);
