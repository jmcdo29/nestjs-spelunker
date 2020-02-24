# NestJS-Spelunker

## Description

This module does a bit of a dive through the provided module and reads through the dependency tree from the point of entry given. It will find what a module `imports`, `provides`, has `controllers` for, and `exports` and will recursively search through the dependency tree until all modules have been scanned. For `providers` if there is a custom provider, the Spelunker will do its best to determine if Nest is to use a value, a class/standard, or a factory, and if a factory, what value is to be injected.

## Options

As of now, the module expects two values in its static `explore` method: an `INestApplication`, obtained by using `NestFactory.create()`, and an _optional_ `LoggerService`. If no logger is provided, a Nest Logger with the context "SpelunkerModule" will be created.

## Usage

Much like the [SwaggerModule](https://github.com/nestjs/swagger), the `SpelunkerModule` is not a module that you register within Nest's DI system, but rather use after the DI system has done all of the heavy lifting. Simple usage of the Spelunker could be like:

```ts
async function bootstrap() {
  const app = await NestFactory.create(AppModule);
  SpelunkerModule.explore(app);
  app.listen(3000);
}
```

The `SpelunkerModule` will not get in the way of application bootstrapping, and will still allow for the server to listen.

## Sample Output

Currently, the SpelunkerModule only logs to the terminal, though this is temporary and will eventually be to a file so that everything can be stylized. For now, this is a sample of the output:

```js
{
  "AppModule": {
    "imports": [
      "AnimalsModule"
    ],
    "providers": {
      "AppService": {
        "method": "standard"
      }
    },
    "controllers": [
      "AppController"
    ],
    "exports": []
  },
  "AnimalsModule": {
    "imports": [
      "DogsModule",
      "CatsModule",
      "HamstersModule"
    ],
    "providers": {},
    "controllers": [],
    "exports": []
  },
  "DogsModule": {
    "imports": [],
    "providers": {
      "DogsService": {
        "method": "standard"
      }
    },
    "controllers": [
      "DogsController"
    ],
    "exports": []
  },
  "CatsModule": {
    "imports": [],
    "providers": {
      "CatsService": {
        "method": "standard"
      }
    },
    "controllers": [
      "CatsController"
    ],
    "exports": []
  },
  "HamstersModule": {
    "imports": [],
    "providers": {
      "HamstersService": {
        "method": "factory",
        "injections": []
      }
    },
    "controllers": [
      "HamstersController"
    ],
    "exports": []
  }
}
```

In this example, `AppModule` imports `AnimalsModule`, and `AnimalsModule` imports `CatsModule`, `DogsModule`, and `HamstersModule` and each of those has its own set of `providers` and `controllers`.

## Caution

This package is in early development, and any bugs found or improvements that can be thought of would be amazingly helpful. You can [log a bug here](/issues/new), and you can reach out to me on Discord at [PerfectOrphan#6003](https://discordapp.com).
