export const exploreOutput = {
  AnimalsModule: {
    controllers: ['AnimalsController'],
    exports: [],
    imports: ['CatsModule', 'DogsModule', 'HamstersModule'],
    providers: { AnimalsService: { method: 'standard' } },
  },
  AppModule: {
    controllers: [],
    exports: [],
    imports: ['AnimalsModule'],
    providers: {},
  },
  CatsModule: {
    controllers: ['CatsController'],
    exports: [],
    imports: [],
    providers: { CatsService: { method: 'standard' } },
  },
  DogsModule: {
    controllers: ['DogsController'],
    exports: [],
    imports: [],
    providers: { DogsService: { method: 'standard' } },
  },
  HamstersModule: {
    controllers: ['HamstersController'],
    exports: [],
    imports: [],
    providers: { HamstersService: { method: 'standard' } },
  },
};
