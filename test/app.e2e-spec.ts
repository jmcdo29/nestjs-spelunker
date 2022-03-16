import { INestApplication } from '@nestjs/common';
import { NestFactory } from '@nestjs/core';
import { dequal } from 'dequal';
import { suite } from 'uvu';
import { equal, is, ok } from 'uvu/assert';
import { SpelunkerModule } from '../src/';
import { AppModule } from './app/app.module';
import { debugOutput, exploreOutput } from './fixtures/output';

const SpelunkerSuite = suite<{ app: INestApplication }>('SpelunkerSuite', {
  app: undefined,
});

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

SpelunkerSuite.run();
