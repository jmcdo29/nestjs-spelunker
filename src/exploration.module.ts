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

export type ExplorationOpts = {
  ignoreImports?: Array<RegExp | ((moduleName: string) => boolean)>;
};

type ShouldIncludeModuleFn = (module: NestModule) => boolean;

export class ExplorationModule {
  static explore(
    app: INestApplicationContext,
    opts?: ExplorationOpts,
  ): SpelunkedTree[] {
    const modulesArray = Array.from(
      ((app as any).container as NestContainer).getModules().values(),
    );

    const ignoreImportsPredicateFns = (opts?.ignoreImports || []).map(
      (ignoreImportFnOrRegex) =>
        ignoreImportFnOrRegex instanceof RegExp
          ? (moduleName: string) => ignoreImportFnOrRegex.test(moduleName)
          : ignoreImportFnOrRegex,
    );
    const shouldIncludeModule: ShouldIncludeModuleFn = (
      module: NestModule,
    ): boolean => {
      const moduleName = module.metatype.name;
      return (
        module.metatype !== InternalCoreModule &&
        !ignoreImportsPredicateFns.some((predicate) => predicate(moduleName))
      );
    };

    // NOTE: Using for..of here instead of filter+map for performance reasons.
    const dependencyMap: SpelunkedTree[] = [];
    for (const nestjsModule of modulesArray) {
      if (shouldIncludeModule(nestjsModule)) {
        dependencyMap.push({
          name: nestjsModule.metatype.name,
          imports: this.getImports(nestjsModule, shouldIncludeModule),
          providers: this.getProviders(nestjsModule),
          controllers: this.getControllers(nestjsModule),
          exports: this.getExports(nestjsModule),
        });
      }
    }
    return dependencyMap;
  }

  private static getImports(
    module: NestModule,
    shouldIncludeModuleFn: ShouldIncludeModuleFn,
  ): string[] {
    // NOTE: Using for..of here instead of filter+map for performance reasons.
    const importsNames: string[] = [];
    for (const importedModule of module.imports.values()) {
      if (shouldIncludeModuleFn(importedModule)) {
        importsNames.push(importedModule.metatype.name);
      }
    }
    return importsNames;
  }

  private static getProviders(module: NestModule): SpelunkedTree['providers'] {
    const providerList: SpelunkedTree['providers'] = {};
    // NOTE: Using for..of here instead of filter+forEach for performance reasons.
    for (const provider of module.providers.keys()) {
      if (
        provider === module.metatype ||
        provider === ModuleRef ||
        provider === ApplicationConfig
      ) {
        continue;
      }

      const providerToken = this.getInjectionToken(provider);
      const providerInstanceWrapper = module.providers.get(provider);
      if (providerInstanceWrapper === undefined) {
        throw new Error(UndefinedProvider(providerToken));
      }
      const metatype = providerInstanceWrapper.metatype;
      const name = (metatype && metatype.name) || 'useValue';
      let provided: SpelunkedTree['providers'][number];
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
            injections: providerInstanceWrapper.inject?.map((injection) =>
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
    }
    return providerList;
  }

  private static getControllers(module: NestModule): string[] {
    const controllersNames: string[] = [];
    for (const controller of module.controllers.values()) {
      controllersNames.push(controller.metatype.name);
    }
    return controllersNames;
  }

  private static getExports(module: NestModule): string[] {
    const exportsNames: string[] = [];
    for (const exportValue of module.exports.values()) {
      exportsNames.push(this.getInjectionToken(exportValue));
    }
    return exportsNames;
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
    return !!(token as any)['token'];
  }
}
