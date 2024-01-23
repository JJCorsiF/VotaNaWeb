import { Test, TestingModule } from '@nestjs/testing';

import { PautaService } from './pauta.service';

describe('PautaService', () => {
  let service: PautaService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [PautaService],
    }).compile();

    service = module.get<PautaService>(PautaService);

    service.cadastrar({ descricao: 'nova pauta', categoria: 'testes' });
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });
});
