import { Test, TestingModule } from '@nestjs/testing';
import { VotacaoController } from './votacao.controller';

describe('VotacaoController', () => {
  let controller: VotacaoController;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [VotacaoController],
    }).compile();

    controller = module.get<VotacaoController>(VotacaoController);
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });
});
