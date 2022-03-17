import { Controller, Inject } from '@nestjs/common';

import { CatsService } from './cats.service';

@Controller('cats')
export class CatsController {
  constructor(
    @Inject(CatsService.name) private readonly catService: CatsService,
  ) {}
}
