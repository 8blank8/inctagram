import { Test, TestingModule } from '@nestjs/testing';
import { FilesController } from './files.controller';
import { FilesService } from './files.service';
import { HttpModule } from '@nestjs/axios';

describe('AuthController', () => {
  let authController: FilesController;

  beforeEach(async () => {
    const app: TestingModule = await Test.createTestingModule({
      imports: [HttpModule],
      controllers: [FilesController],
      providers: [FilesService],
    }).compile();

    authController = app.get<FilesController>(FilesController);
  });

  describe('root', () => {
    it('should return "THIS_IS_FILES!!!"', () => {
      expect(authController.getHello()).toBe('THIS_IS_FILES!!!');
    });
  });
});
