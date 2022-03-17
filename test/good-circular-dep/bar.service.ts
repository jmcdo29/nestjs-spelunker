import { forwardRef, Inject, Injectable } from '@nestjs/common';

import { FooService } from './foo.service';

@Injectable()
export class BarService {
  constructor(
    @Inject(forwardRef(() => FooService)) private readonly foo: FooService,
  ) {}
}
