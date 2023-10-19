import { Injectable } from '@nestjs/common';

@Injectable()
export class FilesService {
  getHello(): string {
    return 'THIS_IS_FILES!!!';
  }
}
