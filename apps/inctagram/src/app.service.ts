import { Injectable } from '@nestjs/common';
import { WELCOME_MESSAGE } from './utils/variables';

@Injectable()
export class AppService {
  getHello(): string {
    return WELCOME_MESSAGE;
  }
}
