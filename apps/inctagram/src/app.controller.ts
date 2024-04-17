import { Controller, Get } from '@nestjs/common';
import { AppService } from './app.service';
import { appSetting } from '@libs/core/app-setting';

@Controller({ host: appSetting.MAIN_HOST })
export class AppController {
  constructor(private readonly appService: AppService) { }

  @Get()
  getHello(): string {
    return this.appService.getHello();
  }
}
