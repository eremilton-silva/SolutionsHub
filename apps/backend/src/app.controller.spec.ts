import { Test, TestingModule } from '@nestjs/testing';
import { AppController } from './app.controller';
import { AppService } from './app.service';

describe('AppController', () => {
  let appController: AppController;

  beforeEach(async () => {
    const app: TestingModule = await Test.createTestingModule({
      controllers: [AppController],
      providers: [AppService],
    }).compile();

    appController = app.get<AppController>(AppController);
  });

  describe('root', () => {
    it('should return Solution Hub API message', () => {
      const result = appController.getHello();
      expect(result).toContain('Solution Hub API está funcionando!');
      expect(result).toContain('/api/v1/info');
      expect(result).toContain('/api/v1/health');
    });
  });
});
