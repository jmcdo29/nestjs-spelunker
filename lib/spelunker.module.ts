import { INestApplication, HttpModule } from '@nestjs/common';
import { NestContainer } from '@nestjs/core';
import { InternalCoreModule } from '@nestjs/core/injector/internal-core-module';
import { Module as NestModule } from '@nestjs/core/injector/module';
import { SpelunkedTree } from './spelunker.interface';

export class SpelunkerModule {
  static explore(app: INestApplication): SpelunkedTree[] {
    const dependencyMap = [];
    const modulesArray = Array.from(
      ((app as any).container as NestContainer).getModules().values(),
    );
    modulesArray
      .filter(
        (module) =>
          module.metatype.name !== InternalCoreModule.name &&
          module.metatype.name !== HttpModule.name,
      )
      .forEach((module) => {
        dependencyMap.push({
          name: module.metatype.name,
          imports: this.getImports(module),
          providers: this.getProviders(module),
          controllers: this.getControllers(module),
          exports: this.getExports(module),
        });
      });
    return dependencyMap;
  }

  private static getImports(module: NestModule): string[] {
    return Array.from(module.imports)
      .filter((module) => module.metatype.name !== InternalCoreModule.name)
      .map((module) => module.metatype.name);
  }

  private static getProviders(module: NestModule): any {
    const providerList = {};
    const providerNames = Array.from(module.providers.keys()).filter(
      (provider) =>
        provider !== module.metatype.name &&
        provider !== 'ModuleRef' &&
        provider !== 'ApplicationConfig',
    );
    providerNames.map((prov) => {
      const provider = module.providers.get(prov);
      const metatype = provider.metatype;
      const name = (metatype && metatype.name) || 'useValue';
      let provided = {};
      switch (name) {
        case 'useValue':
          provided = {
            method: 'value',
          };
          break;
        case 'useClass':
          provided = {
            method: 'class',
          };
          break;
        case 'useFactory':
          provided = {
            method: 'factory',
            injections: provider.inject,
          };
          break;
        default:
          provided = {
            method: 'standard',
          };
      }
      providerList[prov] = provided;
    });
    return providerList;
  }

  private static getControllers(module: NestModule): string[] {
    return Array.from(module.controllers.values()).map(
      (controller) => controller.metatype.name,
    );
  }

  private static getExports(module: NestModule): string[] {
    return Array.from(module.exports).map((exportValue) =>
      exportValue.toString(),
    );
  }
}
