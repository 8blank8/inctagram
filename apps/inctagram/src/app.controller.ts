import { Controller, Get, Inject, Param } from '@nestjs/common';
import { ClientProxy } from '@nestjs/microservices';
import { ApiOperation, ApiResponse } from '@nestjs/swagger';
import { UserEntity } from '@app/main/user/entity/user.entity';

import { AppService } from './app.service';
import { UserQueryRepository } from '@app/main/user/repository/user-query.repository';

@Controller()
export class AppController {
  constructor(
    @Inject('FILE_SERVICE') private client: ClientProxy,
    private readonly userQueryRepository: UserQueryRepository,
    private appService: AppService,
  ) {}

  @Get()
  getHello() {
    return this.appService.getHello();
  }

  @ApiOperation({ summary: 'get all users' })
  @ApiResponse({
    status: 200,
    description: 'The found record',
    type: UserEntity,
    isArray: true,
  })
  @Get('users')
  getUsers(@Param() queryParam) {
    return this.userQueryRepository.findAllUsers(queryParam);
  }

  @Get('files')
  async getFiles(): Promise<any> {
    return this.client.send({ cmd: 'YOUR_PATTERN' }, {}).toPromise();
  }
}
