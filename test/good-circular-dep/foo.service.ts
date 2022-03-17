import { forwardRef, Inject, Injectable } from '@nestjs/common';

import { BarService } from './bar.service';

@Injectable()
export class FooService {
  constructor(
    @Inject(forwardRef(() => BarService)) private readonly bar: BarService,
  ) {}
}
