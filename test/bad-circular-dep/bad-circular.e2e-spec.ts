import { suite } from 'uvu';
import { equal } from 'uvu/assert';

import { SpelunkerModule } from '../../src';
import { AppModule } from './app.module';

export const BadCircularSuite = suite('BadCircularSuite');

BadCircularSuite('it should still print out a tree', async () => {
  const output = await SpelunkerModule.debug(AppModule);
  equal(output, [
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
      providers: [
        { name: 'FooService', dependencies: ['Object'], type: 'class' },
      ],
      controllers: [],
      exports: [{ name: 'FooService', type: 'provider' }],
    },
    {
      name: 'BarModule',
      imports: ['FooModule'],
      providers: [
        { name: 'BarService', dependencies: ['FooService'], type: 'class' },
      ],
      controllers: [],
      exports: [{ name: 'BarService', type: 'provider' }],
    },
  ]);
});
