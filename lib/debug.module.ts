import { Type } from '@nestjs/common';
import { MODULE_METADATA } from '@nestjs/common/constants';
import {
  DebuggedTree,
  DebuggedProvider,
  ProviderType,
  CustomProvider,
  DebuggedExports,
} from './spelunker.interface';

export class DebugModule {
  static debug(modRef: Type<any>): DebuggedTree[] {
    const debuggedTree: DebuggedTree[] = [];
    const imports: string[] = [];
    const providers: (DebuggedProvider & { type: ProviderType })[] = [];
    const controllers: DebuggedProvider[] = [];
    const exports: DebuggedExports[] = [];
    console.log(modRef);
    for (const key of Reflect.getMetadataKeys(modRef)) {
      switch (key) {
        case MODULE_METADATA.IMPORTS:
          const baseImports = DebugModule.getImports(modRef);
          for (const imp of baseImports) {
            debuggedTree.push(...DebugModule.debug(imp));
          }
          imports.push(...baseImports.map((imp) => imp.name));
          break;
        case MODULE_METADATA.PROVIDERS:
          providers.push(...DebugModule.getProviders(modRef));
          break;
        case MODULE_METADATA.CONTROLLERS:
          const baseControllers = DebugModule.getController(modRef);
          const debuggedControllers = [];
          for (const controller of baseControllers) {
            debuggedControllers.push({
              name: controller.name,
              dependencies: DebugModule.getDependencies(controller),
            });
          }
          controllers.push(...debuggedControllers);
          break;
        case MODULE_METADATA.EXPORTS:
          const baseExports = DebugModule.getExports(modRef);
          exports.push(
            ...baseExports.map((exp) => ({
              name: exp.name,
              type: DebugModule.exportType(exp),
            })),
          );
          break;
      }
    }
    debuggedTree.push({
      name: modRef.name,
      imports,
      providers,
      controllers,
      exports,
    });
    return debuggedTree;
  }

  private static getImports(modRef: Type<any>): Array<Type<any>> {
    return Reflect.getMetadata(MODULE_METADATA.IMPORTS, modRef);
  }

  private static getController(modRef: Type<any>): Array<Type<any>> {
    return Reflect.getMetadata(MODULE_METADATA.CONTROLLERS, modRef);
  }

  private static getProviders(
    modRef: Type<any>,
  ): (DebuggedProvider & { type: ProviderType })[] {
    const baseProviders = Reflect.getMetadata(
      MODULE_METADATA.PROVIDERS,
      modRef,
    );
    const debuggedProviders: (DebuggedProvider & {
      type: ProviderType;
    })[] = [];
    for (const provider of baseProviders) {
      let dependencies: () => any[];
      // regular providers
      if (!DebugModule.isCustomProvider(provider)) {
        debuggedProviders.push({
          name: provider.name,
          dependencies: DebugModule.getDependencies(provider),
          type: 'class',
        });
        // custom providers
      } else {
        // set provide defaults
        const newProvider: DebuggedProvider & {
          type: ProviderType;
        } = {
          name: DebugModule.getProviderName(provider.provide),
          dependencies: [],
          type: 'class',
        };
        if (provider.useValue) {
          newProvider.type = 'value';
          dependencies = () => [];
        } else if (provider.useFactory) {
          newProvider.type = 'factory';
          dependencies = () => provider.inject.map(DebugModule.getProviderName);
        } else {
          newProvider.type = 'class';
          dependencies = () =>
            DebugModule.getDependencies(
              provider.useClass || provider.useExisting,
            );
        }
        newProvider.dependencies = dependencies();
        debuggedProviders.push(newProvider);
      }
    }
    return debuggedProviders;
  }

  private static getExports(modRef: Type<any>): Array<Type<any>> {
    return Reflect.getMetadata(MODULE_METADATA.EXPORTS, modRef);
  }

  private static getDependencies(classObj: Type<any>): Array<string> {
    const retDeps = [];
    const typedDeps =
      (Reflect.getMetadata('design:paramtypes', classObj) as Array<
        Type<any>
      >) || [];
    for (const dep of typedDeps) {
      retDeps.push(dep.name);
    }
    const selfDeps =
      (Reflect.getMetadata('self:paramtypes', classObj) as [
        { index: number; param: string },
      ]) || [];
    for (const selfDep of selfDeps) {
      retDeps[selfDep.index] = selfDep.param;
    }
    return retDeps;
  }

  private static getProviderName(
    provider: string | symbol | Type<any>,
  ): string {
    return typeof provider === 'function' ? provider.name : provider.toString();
  }

  private static isCustomProvider(
    provider: CustomProvider | Type<any>,
  ): provider is CustomProvider {
    return (provider as any).provide;
  }

  private static exportType(classObj: Type<any>): 'module' | 'provider' {
    let isModule = false;
    for (const key of Object.keys(MODULE_METADATA)) {
      if (Reflect.getMetadata(MODULE_METADATA[key], classObj)) {
        isModule = true;
      }
    }
    return isModule ? 'module' : 'provider';
  }
}
