import { Controller } from '@nestjs/common';
import { HamstersService } from './hamsters.service';

@Controller('hamsters')
export class HamstersController {
  constructor(private readonly hamsterService: HamstersService) {}
}
