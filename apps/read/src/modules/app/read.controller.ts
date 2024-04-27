import { Controller, Get } from '@nestjs/common';
import { ReadService } from './read.service';

@Controller()
export class ReadController {
  constructor(private readonly readService: ReadService) { }

  @Get()
  getHello(): string {
    return this.readService.getHello();
  }
}
