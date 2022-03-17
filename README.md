# NestJS-Spelunker

## Description

This module does a bit of a dive through the provided module and reads through the dependency tree from the point of entry given. It will find what a module `imports`, `provides`, has `controllers` for, and `exports` and will recursively search through the dependency tree until all modules have been scanned. For `providers` if there is a custom provider, the Spelunker will do its best to determine if Nest is to use a value, a class/standard, or a factory, and if a factory, what value is to be injected.

## Installation

Pretty straightforward installation:

```sh
npm i nestjs-spelunker
yarn add nestjs-spelunker
pnpm i nestjs-spelunker
```

## Exploration Mode

### Exploration Usage

Much like the [SwaggerModule](https://github.com/nestjs/swagger), the `SpelunkerModule` is not a module that you register within Nest's DI system, but rather use after the DI system has done all of the heavy lifting. Simple usage of the Spelunker could be like:

```ts
async function bootstrap() {
  const app = await NestFactory.create(AppModule);
  SpelunkerModule.explore(app);
  app.listen(3000);
}
```

The `SpelunkerModule` will not get in the way of application bootstrapping, and will still allow for the server to listen.

### Exploration Sample Output

Currently, the SpelunkerModule only logs to the terminal, though this is temporary and will eventually be to a file so that everything can be stylized. For now, this is a sample of the output:

```js
[
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
      DogsService: {
        method: 'factory',
        injections: ['someString'],
      },
      someString: {
        method: 'value',
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
```

In this example, `AppModule` imports `AnimalsModule`, and `AnimalsModule` imports `CatsModule`, `DogsModule`, and `HamstersModule` and each of those has its own set of `providers` and `controllers`.

## Debug Mode

Every now again again you may find yourself running into problems where Nest can't resolve a provider's dependencies. The `SpelunkerModule` has a `debug` method that's meant to help out with this kind of situation.

### Debug Usage

Assume you have a `DogsModule` with the following information:

```ts
@Module({
  controller: [DogsController],
  exports: [DogsService],
  providers: [
    {
      provide: 'someString',
      useValue: 'something',
    },
    {
      provide: DogsService,
      inject: ['someString'],
      useFactory: (someStringInjection: string) => {
        return new DogsService(someStringInjection),
      },
    }
  ]
})
export class DogsModule {}
```

Now the `SpelunkerModule.debug()` method can be used anywhere with the `DogsModule` to get the dependency tree of the `DogsModule` including what the controller depends on, what imports are made, and what providers exist and their token dependencies.

```ts
async function bootstrap() {
  const dogsDeps = await SpelunkerModule.debug(DogsModule);
  const app = await NestFactory.create(AppModule);
  await app.listen(3000);
}
```

Because this method does not require the `INestApplicationContext` it can be used _before_ the `NestFactory` allowing you to have insight into what is being seen as the injection values and what's needed for the module to run.

### Debug Sample Output

The output of the `debug()` method is an array of metadata, imports, controllers, exports, and providers. The `DogsModule` from above would look like this:

```js
[
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
];
```

### Debug Messages

If you are using the `debug` method and happen to have an invalid circular, the `SpelunkerModule` will write message to the log about the possibility of an unmarked circular dependency, meaning a missing `forwardRef` and the output will have `*****` in place of the `imports` where there's a problem reading the imported module.

## Caution

This package is in early development, and any bugs found or improvements that can be thought of would be amazingly helpful. You can [log a bug here](/issues/new), and you can reach out to me on Discord at [PerfectOrphan#6003](https://discordapp.com).
