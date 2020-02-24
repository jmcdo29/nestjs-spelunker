import {
  INestApplication,
  LoggerService,
  Logger,
  HttpModule,
} from '@nestjs/common';
import { NestContainer } from '@nestjs/core';
import { InternalCoreModule } from '@nestjs/core/injector/internal-core-module';
import { Module as NestModule } from '@nestjs/core/injector/module';

export class SpelunkerModule {
  static explore(
    app: INestApplication,
    logger: LoggerService = new Logger(SpelunkerModule.name),
  ): void {
    const dependencyMap = {};
    const modulesArray = Array.from(
      ((app as any).container as NestContainer).getModules().values(),
    );
    modulesArray
      .filter(
        module =>
          module.metatype.name !== InternalCoreModule.name &&
          module.metatype.name !== HttpModule.name,
      )
      .forEach(module => {
        dependencyMap[module.metatype.name] = {
          imports: SpelunkerModule.getImports(module),
          providers: SpelunkerModule.getProviders(module),
          controllers: SpelunkerModule.getControllers(module),
          exports: SpelunkerModule.getExports(module),
        };
      });
    logger.log(dependencyMap);
  }

  private static getImports(module: NestModule): string[] {
    return Array.from(module.imports)
      .filter(module => module.metatype.name !== InternalCoreModule.name)
      .map(module => module.metatype.name);
  }

  private static getProviders(module: NestModule): any {
    const providerList = {};
    const providerNames = Array.from(module.providers.keys()).filter(
      provider =>
        provider !== module.metatype.name &&
        provider !== 'ModuleRef' &&
        provider !== 'ApplicationConfig',
    );
    providerNames.map(prov => {
      const provider = module.providers.get(prov);
      const metatype = provider.metatype;
      const name = (metatype && metatype.name) || 'useValue';
      switch (name) {
        case 'useValue':
          providerList[prov] = {
            method: 'value',
          };
          break;
        case 'useClass':
          providerList[prov] = {
            method: 'class',
          };
          break;
        case 'useFactory':
          providerList[prov] = {
            method: 'factory',
            injections: provider.inject,
          };
          break;
        default:
          providerList[prov] = {
            method: 'standard',
          };
      }
    });
    return providerList;
  }

  private static getControllers(module: NestModule): string[] {
    return Array.from(module.controllers.values()).map(
      controller => controller.metatype.name,
    );
  }

  private static getExports(module: NestModule): string[] {
    return Array.from(module.exports).map(exportValue =>
      exportValue.toString(),
    );
  }
}
