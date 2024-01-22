import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';

import { Pauta } from '../persistence/pauta.entity';

@Injectable()
export class PautaService {
  constructor(
    @InjectRepository(Pauta)
    private readonly pautaRepository: Repository<Pauta>,
  ) {}

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
