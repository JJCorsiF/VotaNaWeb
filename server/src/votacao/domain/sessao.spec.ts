import { Test, TestingModule } from '@nestjs/testing';

import { Sessao } from './sessao';

describe('VotacaoService', () => {
  let sessao: Sessao;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [Sessao],
    }).compile();

    sessao = module.get<Sessao>(Sessao);
  });

  it('should be defined', () => {
    expect(sessao).toBeDefined();
  });

  it('quando a sessão ainda estiver aberta, expirou deve retornar false', () => {
    //given:
    sessao = new Sessao(new Date(), 2 * 60);

    //when:
    const expirou = sessao.expirou;

    //then:
    expect(expirou).toBeFalsy();
  });

  it('quando a sessão não estiver mais aberta, expirou deve retornar true', () => {
    //given:
    const dataAbertura = new Date();
    dataAbertura.setDate(dataAbertura.getDate() - 1);
    sessao = new Sessao(dataAbertura, 23 * 60 * 60);

    //when:
    const expirou = sessao.expirou;

    //then:
    expect(expirou).toBeTruthy();
  });
});
