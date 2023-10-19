import { Controller, Get } from '@nestjs/common';
import { FilesService } from './files.service';
import { MessagePattern } from '@nestjs/microservices';

@Controller()
export class FilesController {
  constructor(private readonly filesService: FilesService) {}

  @MessagePattern({ cmd: 'YOUR_PATTERN' })
  async yourMethod(): Promise<any> {
    return this.filesService.getHello();
  }

  @Get('/files')
  getHello(): string {
    return this.filesService.getHello();
  }
}
