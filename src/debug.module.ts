import { DynamicModule, ForwardReference, Type } from '@nestjs/common';
import {
  MODULE_METADATA,
  PARAMTYPES_METADATA,
  SELF_DECLARED_DEPS_METADATA,
} from '@nestjs/common/constants';

import {
  CustomProvider,
  DebuggedExports,
  DebuggedProvider,
  DebuggedTree,
  ProviderType,
} from './spelunker.interface';
import { UndefinedClassObject } from './spelunker.messages';

export class DebugModule {
  private static seenModules: Type<any>[] = [];
  static async debug(
    modRef?: Type<any> | DynamicModule | ForwardReference,
    importingModule?: string,
  ): Promise<DebuggedTree[]> {
    const debuggedTree: DebuggedTree[] = [];
    if (modRef === undefined) {
      process.stdout.write(
        `The module "${importingModule}" is trying to import an undefined module. Do you have an unmarked circular dependency?`,
      );
      return [];
    }
    if (typeof modRef === 'function') {
      debuggedTree.push(...(await this.getStandardModuleMetadata(modRef)));
    } else if (this.moduleIsForwardReference(modRef)) {
      const circMod = (modRef as any).forwardRef();
      if (!this.seenModules.includes(circMod)) {
        this.seenModules.push(circMod);
        debuggedTree.push(...(await this.getStandardModuleMetadata(circMod)));
      }
    } else {
      debuggedTree.push(...(await this.getDynamicModuleMetadata(modRef)));
    }
    return debuggedTree.filter((item, index) => {
      const itemString = JSON.stringify(item);
      return (
        index ===
        debuggedTree.findIndex(
          (subItem) => itemString === JSON.stringify(subItem),
        )
      );
    });
  }

  private static moduleIsForwardReference(
    modRef: DynamicModule | ForwardReference,
  ): modRef is ForwardReference {
    return Object.keys(modRef).includes('forwardRef');
  }

  private static async getStandardModuleMetadata(
    modRef: Type<any>,
  ): Promise<DebuggedTree[]> {
    const imports: string[] = [];
    const providers: (DebuggedProvider & { type: ProviderType })[] = [];
    const controllers: DebuggedProvider[] = [];
    const exports: DebuggedExports[] = [];
    const subModules: DebuggedTree[] = [];
    for (const key of Reflect.getMetadataKeys(modRef)) {
      switch (key) {
        case MODULE_METADATA.IMPORTS: {
          const baseImports = this.getImports(modRef);
          for (const imp of baseImports) {
            subModules.push(...(await this.debug(imp, modRef.name)));
          }
          imports.push(
            ...(await Promise.all(
              baseImports.map(async (imp) => this.getImportName(imp)),
            )),
          );
          break;
        }
        case MODULE_METADATA.PROVIDERS: {
          const baseProviders =
            Reflect.getMetadata(MODULE_METADATA.PROVIDERS, modRef) || [];
          providers.push(...this.getProviders(baseProviders));
          break;
        }
        case MODULE_METADATA.CONTROLLERS: {
          const baseControllers = this.getController(modRef);
          const debuggedControllers = [];
          for (const controller of baseControllers) {
            debuggedControllers.push({
              name: controller.name,
              dependencies: this.getDependencies(controller),
            });
          }
          controllers.push(...debuggedControllers);
          break;
        }
        case MODULE_METADATA.EXPORTS: {
          const baseExports = this.getExports(modRef);
          exports.push(
            ...baseExports.map((exp) => ({
              name: exp.name,
              type: this.exportType(exp),
            })),
          );
          break;
        }
      }
    }
    return [
      {
        name: modRef.name,
        imports,
        providers,
        controllers,
        exports,
      },
    ].concat(subModules);
  }

  private static async getDynamicModuleMetadata(
    incomingModule: DynamicModule | Promise<DynamicModule>,
  ): Promise<DebuggedTree[]> {
    const imports: string[] = [];
    const providers: (DebuggedProvider & { type: ProviderType })[] = [];
    const controllers: DebuggedProvider[] = [];
    const exports: DebuggedExports[] = [];
    const subModules: DebuggedTree[] = [];
    let modRef: DynamicModule;
    if ((incomingModule as Promise<DynamicModule>).then) {
      modRef = await incomingModule;
    } else {
      modRef = incomingModule as DynamicModule;
    }
    for (let imp of modRef.imports ?? []) {
      if (typeof imp === 'object') {
        imp = await this.resolveImport(imp);
      }
      subModules.push(...(await this.debug(imp as DynamicModule | Type<any>)));
      imports.push(await this.getImportName(imp));
    }
    providers.push(
      ...this.getProviders((modRef.providers as Type<any>[]) || []),
    );
    const debuggedControllers = [];
    for (const controller of modRef.controllers || []) {
      debuggedControllers.push({
        name: controller.name,
        dependencies: this.getDependencies(controller),
      });
    }
    controllers.push(...debuggedControllers);
    exports.push(
      ...(modRef.exports ?? []).map((exp) => ({
        name:
          typeof exp === 'function'
            ? exp.name
            : // export is an object, not a string or class
            typeof exp === 'object'
            ? // object uses a class export
              ((exp as CustomProvider).provide as Type<any>).name ||
              // object uses a string/symbol export
              (exp as CustomProvider).provide.toString()
            : exp.toString(),
        type: this.exportType(exp as any),
      })),
    );
    return [
      {
        name: modRef.module.name,
        imports,
        providers,
        controllers,
        exports,
      },
    ].concat(subModules);
  }

  private static async getImportName(
    imp:
      | Type<any>
      | DynamicModule
      | Promise<DynamicModule>
      | ForwardReference<any>,
  ): Promise<string> {
    if (imp === undefined) {
      return '*********';
    }
    let name = '';
    const resolvedImp = await this.resolveImport(imp);
    if (typeof resolvedImp === 'function') {
      name = resolvedImp.name;
    } else {
      name = resolvedImp.module.name;
    }
    return name;
  }

  private static async resolveImport(
    imp:
      | Type<any>
      | DynamicModule
      | Promise<DynamicModule>
      | ForwardReference<any>,
  ): Promise<DynamicModule | Type<any>> {
    return (imp as Promise<DynamicModule>).then
      ? await (imp as Promise<DynamicModule>)
      : (imp as ForwardReference<any>).forwardRef
      ? (imp as ForwardReference<any>).forwardRef()
      : (imp as Type<any>);
  }

  private static getImports(modRef: Type<any>): Array<Type<any>> {
    return Reflect.getMetadata(MODULE_METADATA.IMPORTS, modRef);
  }

  private static getController(modRef: Type<any>): Array<Type<any>> {
    return Reflect.getMetadata(MODULE_METADATA.CONTROLLERS, modRef);
  }

  private static getProviders(
    providers: Type<any>[],
  ): (DebuggedProvider & { type: ProviderType })[] {
    const debuggedProviders: (DebuggedProvider & {
      type: ProviderType;
    })[] = [];
    for (const provider of providers) {
      let dependencies: () => any[];
      // regular providers
      if (!this.isCustomProvider(provider)) {
        debuggedProviders.push({
          name: provider.name,
          dependencies: this.getDependencies(provider),
          type: 'class',
        });
        // custom providers
      } else {
        // set provide defaults
        const newProvider: DebuggedProvider & {
          type: ProviderType;
        } = {
          name: this.getProviderName(provider.provide),
          dependencies: [],
          type: 'class',
        };
        if (provider.useValue) {
          newProvider.type = 'value';
          dependencies = () => [];
        } else if (provider.useFactory) {
          newProvider.type = 'factory';
          dependencies = () =>
            (provider.inject ?? []).map(this.getProviderName);
        } else {
          newProvider.type = 'class';
          dependencies = () =>
            this.getDependencies(provider.useClass ?? provider.useExisting);
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

  private static getDependencies(classObj?: Type<any>): Array<string> {
    if (!classObj) {
      throw new Error(UndefinedClassObject);
    }
    const retDeps = [];
    const typedDeps =
      (Reflect.getMetadata(PARAMTYPES_METADATA, classObj) as Array<
        Type<any>
      >) || [];
    for (const dep of typedDeps) {
      retDeps.push(dep.name);
    }
    const selfDeps =
      (Reflect.getMetadata(SELF_DECLARED_DEPS_METADATA, classObj) as [
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

  private static exportType(
    classObj: Type<any> | string | symbol,
  ): 'module' | 'provider' {
    let isModule = false;
    if (typeof classObj !== 'function') {
      return 'provider';
    }
    for (const key of Object.keys(MODULE_METADATA)) {
      if (
        Reflect.getMetadata(
          MODULE_METADATA[key as keyof typeof MODULE_METADATA],
          classObj,
        )
      ) {
        isModule = true;
      }
    }
    return isModule ? 'module' : 'provider';
  }
}
