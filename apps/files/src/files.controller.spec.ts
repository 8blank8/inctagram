import { Test, TestingModule } from '@nestjs/testing';
import { FilesController } from './files.controller';
import { FilesService } from './files.service';

describe('AuthController', () => {
  let authController: FilesController;

  beforeEach(async () => {
    const app: TestingModule = await Test.createTestingModule({
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
