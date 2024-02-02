import { Test, TestingModule } from '@nestjs/testing';
import { getRepositoryToken } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { PautaService } from '../domain/pauta.service';
import { UsuarioService } from '../domain/usuario.service';
import { VotacaoService } from '../domain/votacao.service';
import { Pauta } from '../persistence/pauta.entity';
import { SessaoVotacao } from '../persistence/sessao-votacao.entity';
import { Usuario } from '../persistence/usuario.entity';
import { Voto } from '../persistence/voto.entity';
import { VotacaoController } from './votacao.controller';

describe('VotacaoController', () => {
  let controller: VotacaoController;

  let pautaService: PautaService;
  let votacaoService: VotacaoService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [VotacaoController],
      imports: [],
      providers: [
        PautaService,
        UsuarioService,
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

    controller = module.get<VotacaoController>(VotacaoController);

    pautaService = module.get<PautaService>(PautaService);
    votacaoService = module.get<VotacaoService>(VotacaoService);
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });

  it('deve chamar o método abrirSessao no service', () => {
    //given:
    const id = 'idSessao';
    jest.spyOn(votacaoService, 'abrirSessao').mockImplementation();

    //when:
    controller.abrirSessao(id, 60);

    //then:
    expect(votacaoService.abrirSessao).toHaveBeenCalled();
  });

  it('deve chamar o método receberVoto no service', () => {
    //given:
    const id = 'idSessao';
    jest.spyOn(votacaoService, 'receberVoto').mockImplementation();

    //when:
    controller.receberVoto(id, {});

    //then:
    expect(votacaoService.receberVoto).toHaveBeenCalled();
  });

  it('deve chamar o método exibirPauta no service', () => {
    //given:
    const id = 'idSessao';
    jest.spyOn(pautaService, 'exibirPauta').mockImplementation();

    //when:
    controller.exibirPauta(id);

    //then:
    expect(pautaService.exibirPauta).toHaveBeenCalled();
  });

  it('deve chamar o método listarPautas no service', () => {
    //given:
    jest.spyOn(pautaService, 'listarPautas').mockImplementation(async () => []);

    //when:
    controller.listarPautas();

    //then:
    expect(pautaService.listarPautas).toHaveBeenCalled();
  });

  it('deve chamar o método cadastrarPauta no service', () => {
    //given:
    jest.spyOn(pautaService, 'cadastrarPauta').mockImplementation();

    //when:
    controller.cadastrarPauta({});

    //then:
    expect(pautaService.cadastrarPauta).toHaveBeenCalled();
  });
});
