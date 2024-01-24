import { Test, TestingModule } from '@nestjs/testing';

import { getRepositoryToken } from '@nestjs/typeorm';
import { InsertResult, Repository } from 'typeorm';
import { Pauta } from '../persistence/pauta.entity';
import { SessaoVotacao } from '../persistence/sessao-votacao.entity';
import { Usuario } from '../persistence/usuario.entity';
import { Voto } from '../persistence/voto.entity';
import { VotacaoService } from './votacao.service';

describe('VotacaoService', () => {
  let service: VotacaoService;

  let pautaRepo: Repository<Pauta>;
  let sessaoRepo: Repository<SessaoVotacao>;
  let usuarioRepo: Repository<Usuario>;
  let votoRepo: Repository<Voto>;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        VotacaoService,
        {
          provide: getRepositoryToken(Pauta),
          useClass: Repository,
        },
        {
          provide: getRepositoryToken(SessaoVotacao),
          useClass: Repository,
        },
        {
          provide: getRepositoryToken(Usuario),
          useClass: Repository,
        },
        {
          provide: getRepositoryToken(Voto),
          useClass: Repository,
        },
      ],
    }).compile();

    service = module.get<VotacaoService>(VotacaoService);

    pautaRepo = module.get<Repository<Pauta>>(getRepositoryToken(Pauta));
    sessaoRepo = module.get<Repository<SessaoVotacao>>(
      getRepositoryToken(SessaoVotacao),
    );
    usuarioRepo = module.get<Repository<Usuario>>(getRepositoryToken(Usuario));
    votoRepo = module.get<Repository<Voto>>(getRepositoryToken(Voto));
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });

  it('service insere uma nova sessão no repository', () => {
    //given:
    const id = 'idPauta';
    jest
      .spyOn(pautaRepo, 'findOneBy')
      .mockImplementation(async () => new Pauta());
    jest
      .spyOn(sessaoRepo, 'create')
      .mockImplementation(() => new SessaoVotacao());
    jest
      .spyOn(sessaoRepo, 'insert')
      .mockImplementation(async () => new InsertResult());

    //when:
    service.abrirSessao(id, 69);

    //then:
    expect(sessaoRepo.insert).toHaveBeenCalled();
  });

  it('service insere um novo voto no repository', () => {
    //given:
    const id = 'idPauta';
    jest.spyOn(pautaRepo, 'findOne').mockImplementation(async () => {
      const pauta = new Pauta();
      pauta.sessao = new SessaoVotacao();
      pauta.sessao.dataAbertura = new Date();
      return pauta;
    });
    jest.spyOn(usuarioRepo, 'findOneBy').mockImplementation(async () => {
      const usuario = new Usuario();
      usuario.cpf = '12345678910';
      return usuario;
    });
    jest.spyOn(votoRepo, 'findOne').mockImplementation(async () => null);
    jest.spyOn(votoRepo, 'create').mockImplementation(() => new Voto());
    jest
      .spyOn(votoRepo, 'insert')
      .mockImplementation(async () => new InsertResult());

    //when:
    service.receberVoto(id, { cpf: '12345678910', voto: 'Sim' });

    //then:
    expect(votoRepo.insert).toHaveBeenCalled();
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
