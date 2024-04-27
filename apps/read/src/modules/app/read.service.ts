import { Injectable } from '@nestjs/common';

@Injectable()
export class ReadService {
  getHello(): string {
    return 'Hello World!';
  }
}
