import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';

import { ExibirPautaResponse } from '../api/exibir-pauta.response';
import { Pauta } from '../persistence/pauta.entity';
import { SessaoVotacao } from '../persistence/sessao-votacao.entity';
import { Sessao } from './sessao';

@Injectable()
export class PautaService {
  constructor(
    @InjectRepository(Pauta)
    private readonly pautaRepository: Repository<Pauta>,
    @InjectRepository(SessaoVotacao)
    private readonly sessaoRepository: Repository<SessaoVotacao>,
  ) {}

  async exibirPauta(id: string): Promise<ExibirPautaResponse> {
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

    const expirou = this.sessaoExpirou(sessaoAberta);
    const foiAprovada = this.foiAprovada(sessaoAberta);

    if (expirou) {
      const resultado = foiAprovada ? 'Sim' : 'Não';
      await this.sessaoRepository.update(sessaoAberta.id, {
        resultado,
      });
    }

    return {
      descricao: pauta.descricao,
      categoria: pauta.categoria,
      foiAprovada,
      sessao: sessaoAberta
        ? {
            expirou,
            totalVotos,
          }
        : null,
    };
  }

  async listarPautas(): Promise<Pauta[]> {
    return await this.pautaRepository.find({
      relations: {
        sessao: true,
      },
    });
  }

  async cadastrarPauta(pauta): Promise<Pauta> {
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
