import { ok } from 'assert';
import { suite } from 'uvu';
import { unreachable } from 'uvu/assert';

import { DebuggedTree, SpelunkerModule } from '../../src';
import { AppModule } from './app.module';

type ServiceHasDependencyOptions = {
  moduleName: string;
  serviceName: string;
  dependencyName: string;
};

const serviceHasDependency = (
  output: DebuggedTree[],
  options: ServiceHasDependencyOptions,
): void => {
  const module = output.find((mod) => mod.name === options.moduleName);
  if (!module) {
    unreachable(`Module ${options.moduleName} was not in the debugged tree`);
  }
  const service = module!.providers.find(
    (provider) => provider.name === options.serviceName,
  );
  if (!service) {
    unreachable(
      `Provider ${options.serviceName} was not found in the module ${options.moduleName}`,
    );
  }
  const serviceHasDep = service!.dependencies.find(
    (dep) => dep === options.dependencyName,
  );
  ok(
    serviceHasDep,
    `Dependency ${options.dependencyName} was not found for provider ${options.serviceName}`,
  );
};

export const GoodCircularSuite = suite('GoodCircularSuite');

GoodCircularSuite('it should still print out a tree', async () => {
  const output = await SpelunkerModule.debug(AppModule);
  ok(output);
  serviceHasDependency(output, {
    moduleName: 'FooModule',
    serviceName: 'FooService',
    dependencyName: 'BarService',
  });
  serviceHasDependency(output, {
    moduleName: 'BarModule',
    serviceName: 'BarService',
    dependencyName: 'FooService',
  });
});
