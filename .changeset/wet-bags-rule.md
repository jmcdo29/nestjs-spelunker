---
'nestjs-spelunker': major
---

First major version of the nestjs-spelunker package.
Nest v8 is supported with it's new class token syntax
pared down to just the class name. Circular dependencies
that are not properly forwardReferenced will no longer
crash the `debug` method. `@ogma/styler` is being used
to color the output of the module in case of uncertain
errors or improper tokens.
