import { SpelunkedTree } from 'lib/spelunker.interface';

export const exploreOutput: SpelunkedTree[] = [
  {
    name: 'AppModule',
    imports: ['AnimalsModule'],
    providers: {},
    controllers: [],
    exports: [],
  },
  {
    name: 'AnimalsModule',
    imports: ['CatsModule', 'DogsModule', 'HamstersModule'],
    providers: {
      AnimalsService: {
        method: 'value',
      },
    },
    controllers: ['AnimalsController'],
    exports: [],
  },
  {
    name: 'CatsModule',
    imports: [],
    providers: {
      CatsService: {
        method: 'standard',
      },
    },
    controllers: ['CatsController'],
    exports: [],
  },
  {
    name: 'DogsModule',
    imports: [],
    providers: {
      DogsService: {
        method: 'factory',
        injections: [],
      },
    },
    controllers: ['DogsController'],
    exports: [],
  },
  {
    name: 'HamstersModule',
    imports: [],
    providers: {
      HamstersService: {
        method: 'standard',
      },
    },
    controllers: ['HamstersController'],
    exports: [],
  },
];
