import { Test, TestingModule } from '@nestjs/testing';
import { ReadController } from './read.controller';
import { ReadService } from './read.service';

describe('ReadController', () => {
  let readController: ReadController;

  beforeEach(async () => {
    const app: TestingModule = await Test.createTestingModule({
      controllers: [ReadController],
      providers: [ReadService],
    }).compile();

    readController = app.get<ReadController>(ReadController);
  });

  describe('root', () => {
    it('should return "Hello World!"', () => {
      expect(readController.getHello()).toBe('Hello World!');
    });
  });
});
