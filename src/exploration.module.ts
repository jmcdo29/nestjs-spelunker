import {
  INestApplicationContext,
  InjectionToken,
  OptionalFactoryDependency,
} from '@nestjs/common';
import { ApplicationConfig, ModuleRef, NestContainer } from '@nestjs/core';
import { InternalCoreModule } from '@nestjs/core/injector/internal-core-module';
import { Module as NestModule } from '@nestjs/core/injector/module';

import { SpelunkedTree } from './spelunker.interface';
import { UndefinedProvider } from './spelunker.messages';

export class ExplorationModule {
  static explore(app: INestApplicationContext): SpelunkedTree[] {
    const dependencyMap: SpelunkedTree[] = [];
    const modulesArray = Array.from(
      ((app as any).container as NestContainer).getModules().values(),
    );
    modulesArray
      .filter((module) => module.metatype !== InternalCoreModule)
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
    const providerList: Record<
      string,
      { method: string; injections?: string[] }
    > = {};
    const providerNames = Array.from(module.providers.keys()).filter(
      (provider) =>
        provider !== module.metatype &&
        provider !== ModuleRef &&
        provider !== ApplicationConfig,
    );
    providerNames.map((prov) => {
      const providerToken = this.getInjectionToken(prov);
      const provider = module.providers.get(prov);
      if (provider === undefined) {
        throw new Error(UndefinedProvider(providerToken));
      }
      const metatype = provider.metatype;
      const name = (metatype && metatype.name) || 'useValue';
      let provided: { method: string; injections?: string[] };
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
            injections: provider.inject?.map((injection) =>
              this.getInjectionToken(injection),
            ),
          };
          break;
        default:
          provided = {
            method: 'standard',
          };
      }
      providerList[providerToken] = provided;
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
      this.getInjectionToken(exportValue),
    );
  }

  private static getInjectionToken(
    injection: InjectionToken | OptionalFactoryDependency,
  ): string {
    return typeof injection === 'function'
      ? injection.name
      : this.tokenIsOptionalToken(injection)
      ? injection.token.toString()
      : injection.toString();
  }

  private static tokenIsOptionalToken(
    token: InjectionToken | OptionalFactoryDependency,
  ): token is OptionalFactoryDependency {
    return Object.keys(token).includes('token');
  }
}
