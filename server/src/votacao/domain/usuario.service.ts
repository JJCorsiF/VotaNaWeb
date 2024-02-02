import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';

import { Usuario } from '../persistence/usuario.entity';

@Injectable()
export class UsuarioService {
  constructor(
    @InjectRepository(Usuario)
    private readonly usuarioRepository: Repository<Usuario>,
  ) {}

  async buscarUsuarioPorCpf(cpf: string) {
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
}
