import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';

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
}
