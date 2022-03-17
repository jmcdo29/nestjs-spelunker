import { INestApplication } from '@nestjs/common';
import { NestFactory } from '@nestjs/core';
import { dequal } from 'dequal';
import { suite } from 'uvu';
import { equal, is } from 'uvu/assert';

import { SpelunkerModule } from '../../src/';
import { debugOutput, exploreOutput } from '../fixtures/output';
import { AppModule } from './app.module';

export const SpelunkerSuite = suite<{ app: INestApplication }>(
  'SpelunkerSuite',
  {
    // @ts-expect-error property will be defined in the `before` context
    app: undefined,
  },
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
