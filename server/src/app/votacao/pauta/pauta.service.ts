import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';

import { ExibirPautaResponse } from '../api/exibir-pauta.response';
import { Sessao } from '../domain/sessao';
import { Pauta } from '../persistence/pauta.entity';
import { SessaoVotacao } from '../persistence/sessao-votacao.entity';

@Injectable()
export class PautaService {
  constructor(
    @InjectRepository(Pauta)
    private readonly pautaRepository: Repository<Pauta>,
    @InjectRepository(SessaoVotacao)
    private readonly sessaoRepository: Repository<SessaoVotacao>,
  ) {}

  async abrirSessao(idPauta: string, duracao: number) {
    const pauta = await this.pautaRepository.findOneBy({
      id: idPauta,
    });

    if (!pauta) {
      return;
    }

    const novaSessao = this.sessaoRepository.create({
      dataAbertura: new Date(),
      duracao: 60 * duracao,
      pauta,
    });
    await this.sessaoRepository.insert(novaSessao);
  }

  async exibir(id: string): Promise<ExibirPautaResponse> {
    const pauta = await this.pautaRepository.findOne({
      where: {
        id,
      },
      relations: {
        sessao: {
          votos: true,
        },
      },
    });

    const sessaoAberta = pauta?.sessao;

    const totalVotos = sessaoAberta?.votos?.length ?? 0;

    return {
      descricao: pauta.descricao,
      categoria: pauta.categoria,
      foiAprovada: this.foiAprovada(sessaoAberta),
      sessao: {
        expirou: this.sessaoExpirou(sessaoAberta),
        totalVotos,
      },
    };
  }

  async listarTodas(): Promise<Pauta[]> {
    return await this.pautaRepository.find();
  }

  async cadastrar(pauta): Promise<Pauta> {
    const novaPauta = this.pautaRepository.create({
      descricao: pauta.descricao,
      categoria: pauta.categoria,
    });
    await this.pautaRepository.insert(novaPauta);

    return novaPauta;
  }

  private foiAprovada(sessaoVotacao: SessaoVotacao): boolean {
    if (!sessaoVotacao) {
      return false;
    }

    const votosAFavor = sessaoVotacao.votos.filter(
      (voto) => voto.voto === 'Sim',
    ).length;

    return 2 * votosAFavor > sessaoVotacao.votos.length;
  }

  private sessaoExpirou(sessaoVotacao: SessaoVotacao): boolean {
    if (!sessaoVotacao) {
      return false;
    }

    const sessao = new Sessao(
      sessaoVotacao.dataAbertura,
      sessaoVotacao.duracao,
    );

    return sessao.expirou;
  }
}
