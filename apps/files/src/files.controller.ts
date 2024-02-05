import { Controller, Get } from '@nestjs/common';
import { FilesService } from './files.service';
import { MessagePattern } from '@nestjs/microservices';
import { createWriteStream } from 'fs';
import { HttpService } from '@nestjs/axios';

@Controller()
export class FilesController {
  constructor(
    private readonly filesService: FilesService,
    private readonly httpService: HttpService,
  ) {}

  @MessagePattern({ cmd: 'YOUR_PATTERN' })
  async yourMethod(): Promise<any> {
    return this.filesService.getHello();
  }

  @MessagePattern({ cmd: 'SAVE_AVATAR_FROM_EXTERNAL' })
  async downloadImage(data: { url: string }) {
    const writer = createWriteStream('./image.png');

    const response = await this.httpService.axiosRef({
      url: data.url,
      method: 'GET',
      responseType: 'stream',
    });

    response.data.pipe(writer);

    return new Promise((resolve, reject) => {
      writer.on('finish', resolve);
      writer.on('error', reject);
    });
  }

  @Get('/files')
  getHello(): string {
    return this.filesService.getHello();
  }
}
