import {
  Injectable,
  NotFoundException,
  UnprocessableEntityException,
} from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';

import { ExibirPautaResponse } from '../api/exibir-pauta.response';
import { Pauta } from '../persistence/pauta.entity';
import { SessaoVotacao } from '../persistence/sessao-votacao.entity';
import { Usuario } from '../persistence/usuario.entity';
import { Voto } from '../persistence/voto.entity';
import { Sessao } from './sessao';

@Injectable()
export class PautaService {
  constructor(
    @InjectRepository(Pauta)
    private readonly pautaRepository: Repository<Pauta>,
    @InjectRepository(SessaoVotacao)
    private readonly sessaoRepository: Repository<SessaoVotacao>,
    @InjectRepository(Usuario)
    private readonly usuarioRepository: Repository<Usuario>,
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

    const usuario = await this.buscarUsuarioPorCpf(voto.cpf);

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

  async listarTodas(): Promise<Pauta[]> {
    return await this.pautaRepository.find({
      relations: {
        sessao: true,
      },
    });
  }

  async cadastrar(pauta): Promise<Pauta> {
    const novaPauta = this.pautaRepository.create({
      descricao: pauta.descricao,
      categoria: pauta.categoria,
    });
    await this.pautaRepository.insert(novaPauta);

    return novaPauta;
  }

  private async buscarUsuarioPorCpf(cpf: string) {
    let usuario = await this.usuarioRepository.findOneBy({
      cpf,
    });

    if (!usuario) {
      usuario = this.usuarioRepository.create({
        cpf,
      });
      await this.usuarioRepository.insert(usuario);
    }

    return usuario;
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
