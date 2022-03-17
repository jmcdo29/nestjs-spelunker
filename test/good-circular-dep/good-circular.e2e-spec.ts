import { ok } from 'assert';
import { suite } from 'uvu';

import { SpelunkerModule } from '../../src';
import { AppModule } from './app.module';

export const GoodCircularSuite = suite('GoodCircularSuite');

GoodCircularSuite('it should still print out a tree', async () => {
  const output = await SpelunkerModule.debug(AppModule);
  ok(output);
});
