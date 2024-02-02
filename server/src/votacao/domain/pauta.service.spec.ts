import { Test, TestingModule } from '@nestjs/testing';

import { getRepositoryToken } from '@nestjs/typeorm';
import { InsertResult, Repository } from 'typeorm';
import { Pauta } from '../persistence/pauta.entity';
import { SessaoVotacao } from '../persistence/sessao-votacao.entity';
import { PautaService } from './pauta.service';

describe('PautaService', () => {
  let service: PautaService;

  let pautaRepo: Repository<Pauta>;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        PautaService,
        {
          provide: getRepositoryToken(Pauta),
          useClass: Repository,
        },
        {
          provide: getRepositoryToken(SessaoVotacao),
          useClass: Repository,
        },
      ],
    }).compile();

    service = module.get<PautaService>(PautaService);

    pautaRepo = module.get<Repository<Pauta>>(getRepositoryToken(Pauta));
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });

  it('service busca uma pauta do repository', () => {
    //given:
    jest
      .spyOn(pautaRepo, 'findOne')
      .mockImplementation(async () => new Pauta());
    const id = 'idPauta';

    //when:
    service.exibirPauta(id);

    //then:
    expect(pautaRepo.findOne).toHaveBeenCalled();
  });

  it('service busca pautas do repository', () => {
    //given:
    jest.spyOn(pautaRepo, 'find').mockImplementation(async () => []);

    //when:
    service.listarPautas();

    //then:
    expect(pautaRepo.find).toHaveBeenCalled();
  });

  it('service insere uma nova pauta no repository', () => {
    //given:
    const pauta = {};
    jest.spyOn(pautaRepo, 'create').mockImplementation(() => new Pauta());
    jest
      .spyOn(pautaRepo, 'insert')
      .mockImplementation(async () => new InsertResult());

    //when:
    service.cadastrarPauta(pauta);

    //then:
    expect(pautaRepo.insert).toHaveBeenCalled();
  });
});
