import { Body, Controller, Get, Post } from '@nestjs/common';
import { FilesService } from './files.service';

@Controller()
export class FilesController {
  constructor(private readonly filesService: FilesService) { }

  @Get()
  getHello(): string {
    return this.filesService.getHello();
  }

  @Post()
  g(@Body() dto: any) {
    return { dto, m: 'files' }
  }
}
