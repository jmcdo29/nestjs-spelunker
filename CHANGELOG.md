## [0.4.1](https://github.com/jmcdo29/nestjs-spelunker/compare/0.4.0...0.4.1) (2020-08-09)

## 1.3.0

### Minor Changes

- b6b6763: refactor: minor perf improvements and typing changes

## 1.2.0

### Minor Changes

- ed0a420: support excluding modules from graph exploration via `ignoreImports` option

## 1.1.5

### Patch Changes

- 5400375: Fix the fact that circular dependencies didn't actually log correctly with the debug module

## 1.1.4

### Patch Changes

- 178c888: Allow value and factory providers to have falsy values instead of treating them as a class providers

## 1.1.3

### Patch Changes

- b060d4b: docs: add sample source code & remove out-of-date notes

## 1.1.2

### Patch Changes

- 347c65b: docs: minor improvements on code snippets & fix hyperlink

## 1.1.1

### Patch Changes

- 58ae380: Removes cyclic dependencies caveat in README Graph Mode

## 1.1.0

### Minor Changes

- 434eee4: Added graphing.module to generate a SpelunkedNode graph data structure and dependencies as an array of SpelunkedEdge objects.

## 1.0.0

### Major Changes

- bdd36bc: First major version of the nestjs-spelunker package.
  Nest v8 is supported with it's new class token syntax
  pared down to just the class name. Circular dependencies
  that are not properly forwardReferenced will no longer
  crash the `debug` method. `@ogma/styler` is being used
  to color the output of the module in case of uncertain
  errors or improper tokens.

### Features

- **module:** supports object exports ([66a21ef](https://github.com/jmcdo29/nestjs-spelunker/commit/66a21efc5bd335e0792b50c31e866f9407fdd80a))

# [0.4.0](https://github.com/jmcdo29/nestjs-spelunker/compare/0.3.0...0.4.0) (2020-08-09)

### Features

- **module:** supports dynamic modules ([9e0664c](https://github.com/jmcdo29/nestjs-spelunker/commit/9e0664cb08a4a89e0d72933cbf56e35958ceda6b))

### BREAKING CHANGES

- **module:** The `debug` method is now asynchronous.
  This is due to the fact of needing to resolve promise
  based imports.

# [0.3.0](https://github.com/jmcdo29/nestjs-spelunker/compare/0.2.1...0.3.0) (2020-08-08)

### Features

- **module:** adds a debug method to print out modules and deps ([2d8510c](https://github.com/jmcdo29/nestjs-spelunker/commit/2d8510cffe07483521b531bc2760e79641423862))

## [0.2.1](https://github.com/jmcdo29/nestjs-spelunker/compare/0.2.0...0.2.1) (2020-08-07)

### Features

- change explore param type ([23acdd6](https://github.com/jmcdo29/nestjs-spelunker/commit/23acdd6144b9039c7b585f06db2c0efddf1a3f62))

# [0.2.0](https://github.com/jmcdo29/nestjs-spelunker/compare/0.1.0...0.2.0) (2020-06-25)

### Bug Fixes

- **deps:** fixes build script ([bfe48ca](https://github.com/jmcdo29/nestjs-spelunker/commit/bfe48ca13e6b87e895d12972d0d7779ca0ba1fc2))

### Features

- **module:** changes the return to an object ([5b705c8](https://github.com/jmcdo29/nestjs-spelunker/commit/5b705c8b61f9daf3dba2f0e9da6fbf1218f0b4ce))

<a name="0.1.0"></a>

# 0.1.0 (2020-02-24)

### Features

- **module:** implement the first iteration of the spelunker module ([5f50af2](https://github.com/jmcdo29/nestjs-spelunker/commit/5f50af2))
