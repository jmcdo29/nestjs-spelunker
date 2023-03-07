import { suite } from 'uvu';
import { ok } from 'uvu/assert';

import { SpelunkerModule } from '../../src';
import { AppModule } from './app.module';

export const BadCircularSuite = suite('BadCircularSuite');

BadCircularSuite('it should still print out a tree', async () => {
  const output = await SpelunkerModule.debug(AppModule);
  const containsUnknown = output.some((module) =>
    module.providers.some((providers) =>
      providers.dependencies.includes('UNKNOWN'),
    ),
  );
  ok(
    containsUnknown,
    'There should be an "UNKNOWN" in at least on of the modules[].providers[].dedpendencies',
  );
  /*equal(output, [
    {
      name: 'AppModule',
      imports: ['FooModule', 'BarModule'],
      providers: [],
      controllers: [],
      exports: [],
    },
    {
      name: 'FooModule',
      imports: ['*********'],
      providers: [{ name: 'FooService', dependencies: [], type: 'class' }],
      controllers: [],
      exports: [{ name: 'FooService', type: 'provider' }],
    },
    {
      name: 'BarModule',
      imports: ['FooModule'],
      providers: [{ name: 'BarService', dependencies: [], type: 'class' }],
      controllers: [],
      exports: [{ name: 'BarService', type: 'provider' }],
    },
  ]);*/
});
