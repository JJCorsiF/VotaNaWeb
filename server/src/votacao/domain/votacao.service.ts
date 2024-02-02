import {
  Injectable,
  NotFoundException,
  UnprocessableEntityException,
} from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';

import { Pauta } from '../persistence/pauta.entity';
import { SessaoVotacao } from '../persistence/sessao-votacao.entity';
import { Voto } from '../persistence/voto.entity';
import { Sessao } from './sessao';
import { UsuarioService } from './usuario.service';

@Injectable()
export class VotacaoService {
  constructor(
    @InjectRepository(Pauta)
    private readonly pautaRepository: Repository<Pauta>,
    @InjectRepository(SessaoVotacao)
    private readonly sessaoRepository: Repository<SessaoVotacao>,
    private readonly usuarioService: UsuarioService,
    @InjectRepository(Voto)
    private readonly votoRepository: Repository<Voto>,
  ) {}

  async abrirSessao(idPauta: string, duracao: number) {
    const pauta = await this.pautaRepository.findOneBy({
      id: idPauta,
    });

    if (!pauta) {
      throw new NotFoundException(
        'Não foi encontrada pauta com o ID informado',
      );
    }

    const novaSessao = this.sessaoRepository.create({
      dataAbertura: new Date(),
      duracao: 60 * duracao,
      pauta,
    });
    await this.sessaoRepository.insert(novaSessao);
  }

  async receberVoto(idPauta: string, voto) {
    const pauta = await this.pautaRepository.findOne({
      where: {
        id: idPauta,
      },
      relations: {
        sessao: true,
      },
    });

    if (!pauta) {
      throw new NotFoundException(
        'Não foi encontrada pauta com o ID informado',
      );
    }

    const sessao = pauta.sessao;

    if (!sessao) {
      throw new UnprocessableEntityException(
        'Nenhuma sessão foi aberta para essa pauta',
      );
    }

    if (this.sessaoExpirou(sessao)) {
      throw new UnprocessableEntityException('A sessão expirou');
    }

    if (!voto.cpf) {
      throw new UnprocessableEntityException('Por favor informe um CPF');
    }

    const usuario = await this.usuarioService.buscarUsuarioPorCpf(voto.cpf);

    const votoAnterior = await this.votoRepository.findOne({
      where: {
        sessao,
        usuario,
      },
    });

    if (votoAnterior) {
      throw new UnprocessableEntityException('Você já votou nesta pauta');
    }

    const novoVoto = this.votoRepository.create({
      sessao,
      usuario,
      voto: voto.voto,
    });
    await this.votoRepository.insert(novoVoto);

    return novoVoto;
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
