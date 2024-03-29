import { Test, TestingModule } from '@nestjs/testing';
import { ClientsModule, Transport } from '@nestjs/microservices';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { UserService } from './user/user.service';
import { PostService } from './post/post.service';
import { FilesController } from '../../files/src/files.controller';
import { FilesService } from '../../files/src/files.service';
import { WELCOME_MESSAGE } from './utils/variables';
import { PrismaService } from '@app/db';
import { UserQueryRepository } from '@app/main/user/repository/user-query.repository';
import { HttpModule } from '@nestjs/axios';

describe('AppController', () => {
  let appController: AppController;

  beforeEach(async () => {
    const app: TestingModule = await Test.createTestingModule({
      imports: [
        ClientsModule.register([
          {
            name: 'FILE_SERVICE',
            transport: Transport.TCP,
            options: {
              host:
                process.env.FILES_SERVICE_HOST ||
                'backend-files-microservice-service',
              port: Number(process.env.FILES_SERVICE_PORT || '3161'),
            },
          },
        ]),
        HttpModule,
      ],
      controllers: [AppController, FilesController],
      providers: [
        AppService,
        UserQueryRepository,
        UserService,
        PostService,
        PrismaService,
        FilesService,
      ],
    }).compile();

    appController = app.get<AppController>(AppController);
  });

  describe('root', () => {
    it('should return "Hello World! Deployed"', () => {
      expect(appController.getHello()).toBe(WELCOME_MESSAGE);
    });
  });
});
