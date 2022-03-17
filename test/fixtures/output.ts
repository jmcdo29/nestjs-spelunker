import { DebuggedTree, SpelunkedTree } from '../../src';

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
    imports: ['CatsModule', 'DogsModule', 'HamstersModule', 'OgmaCoreModule'],
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
    imports: ['OgmaCoreModule'],
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
    imports: ['OgmaCoreModule'],
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
    imports: ['OgmaCoreModule'],
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
    name: 'AppModule',
    imports: ['AnimalsModule', 'OgmaCoreModule'],
    providers: [],
    controllers: [],
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
    name: 'OgmaCoreModule',
    imports: [],
    providers: [
      {
        name: 'OGMA_OPTIONS',
        dependencies: [],
        type: 'value',
      },
      {
        name: 'OGMA_INTERCEPTOR_OPTIONS',
        dependencies: ['OGMA_OPTIONS'],
        type: 'factory',
      },
      {
        name: 'OGMA_SERVICE_OPTIONS',
        dependencies: ['OGMA_OPTIONS'],
        type: 'factory',
      },
      {
        name: 'OGMA_TRACE_METHOD_OPTION',
        dependencies: ['OGMA_SERVICE_OPTIONS'],
        type: 'factory',
      },
      {
        name: 'OGMA_INSTANCE',
        dependencies: ['OGMA_SERVICE_OPTIONS'],
        type: 'factory',
      },
      {
        name: 'HttpInterceptorService',
        dependencies: ['OGMA_INTERCEPTOR_OPTIONS', 'Reflector'],
        type: 'factory',
      },
      {
        name: 'WebsocketInterceptorService',
        dependencies: ['OGMA_INTERCEPTOR_OPTIONS', 'Reflector'],
        type: 'factory',
      },
      {
        name: 'GqlInterceptorService',
        dependencies: ['OGMA_INTERCEPTOR_OPTIONS', 'Reflector'],
        type: 'factory',
      },
      {
        name: 'RpcInterceptorService',
        dependencies: ['OGMA_INTERCEPTOR_OPTIONS', 'Reflector'],
        type: 'factory',
      },
      {
        name: 'OgmaService',
        dependencies: [
          'OGMA_INSTANCE',
          'OGMA_CONTEXT',
          'Object',
          'OGMA_TRACE_METHOD_OPTION',
        ],
        type: 'class',
      },
      {
        name: 'DelegatorService',
        dependencies: [
          'HttpInterceptorService',
          'WebsocketInterceptorService',
          'RpcInterceptorService',
          'GqlInterceptorService',
        ],
        type: 'class',
      },
    ],
    controllers: [],
    exports: [
      {
        name: 'OGMA_INSTANCE',
        type: 'provider',
      },
      {
        name: 'OGMA_INTERCEPTOR_OPTIONS',
        type: 'provider',
      },
      {
        name: 'OgmaService',
        type: 'provider',
      },
      {
        name: 'DelegatorService',
        type: 'provider',
      },
      {
        name: 'HttpInterceptorService',
        type: 'provider',
      },
      {
        name: 'GqlInterceptorService',
        type: 'provider',
      },
      {
        name: 'RpcInterceptorService',
        type: 'provider',
      },
      {
        name: 'WebsocketInterceptorService',
        type: 'provider',
      },
    ],
  },
];
