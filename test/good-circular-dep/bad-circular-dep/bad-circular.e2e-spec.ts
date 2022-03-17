import { ok } from 'assert';
import { suite } from 'uvu';

import { SpelunkerModule } from '../../src';
import { AppModule } from './app.module';

export const BadCircularSuite = suite('BadCircularSuite');

BadCircularSuite('it should still print out a tree', async () => {
  const output = await SpelunkerModule.debug(AppModule);
  ok(output);
});
