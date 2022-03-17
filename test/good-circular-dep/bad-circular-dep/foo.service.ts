import { Injectable } from '@nestjs/common';

import { BarService } from './bar.service';

@Injectable()
export class FooService {
  constructor(private readonly bar: BarService) {}
}
