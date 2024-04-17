import { Controller, Get } from '@nestjs/common';
import { FilesService } from './files.service';
import { appSetting } from '@libs/core/app-setting';

@Controller({ host: appSetting.FILES_HOST })
export class FilesController {
  constructor(private readonly filesService: FilesService) { }

  @Get()
  getHello(): string {
    return this.filesService.getHello();
  }
}
