import { SpelunkedTree, DebuggedTree } from 'lib/spelunker.interface';

export const exploreOutput: SpelunkedTree[] = [
  {
    name: 'AppModule',
    imports: ['AnimalsModule', 'OgmaCoreModule'],
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
    exports: ['DogsModule'],
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
      someString: {
        method: 'value',
      },
      DogsService: {
        method: 'factory',
        injections: ['someString'],
      },
    },
    controllers: ['DogsController'],
    exports: ['DogsService'],
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

export const debugOutput: DebuggedTree[] = [
  {
    name: 'CatsModule',
    imports: [],
    providers: [
      {
        name: 'CatsService',
        dependencies: [],
        type: 'class',
      },
    ],
    controllers: [
      {
        name: 'CatsController',
        dependencies: ['CatsService'],
      },
    ],
    exports: [],
  },
  {
    name: 'DogsModule',
    imports: [],
    providers: [
      {
        name: 'someString',
        dependencies: [],
        type: 'value',
      },
      {
        name: 'DogsService',
        dependencies: ['someString'],
        type: 'factory',
      },
    ],
    controllers: [
      {
        name: 'DogsController',
        dependencies: ['DogsService'],
      },
    ],
    exports: [
      {
        name: 'DogsService',
        type: 'provider',
      },
    ],
  },
  {
    name: 'HamstersModule',
    imports: [],
    providers: [
      {
        name: 'HamstersService',
        dependencies: [],
        type: 'class',
      },
    ],
    controllers: [
      {
        name: 'HamstersController',
        dependencies: ['HamstersService'],
      },
    ],
    exports: [],
  },
  {
    name: 'AnimalsModule',
    imports: ['CatsModule', 'DogsModule', 'HamstersModule'],
    providers: [
      {
        name: 'AnimalsService',
        dependencies: [],
        type: 'value',
      },
    ],
    controllers: [
      {
        name: 'AnimalsController',
        dependencies: ['AnimalsService'],
      },
    ],
    exports: [
      {
        name: 'DogsModule',
        type: 'module',
      },
    ],
  },
  {
    name: 'AppModule',
    imports: ['AnimalsModule'],
    providers: [],
    controllers: [],
    exports: [],
  },
];
