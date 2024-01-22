import { Test, TestingModule } from '@nestjs/testing';
import { PautaController } from './pauta.controller';

describe('CadastroPautaController', () => {
  let controller: PautaController;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [PautaController],
    }).compile();

    controller = module.get<PautaController>(PautaController);
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });
});
