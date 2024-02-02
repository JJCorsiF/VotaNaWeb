import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';

import { VotacaoController } from './votacao/api/votacao.controller';
import { PautaService } from './votacao/domain/pauta.service';
import { UsuarioService } from './votacao/domain/usuario.service';
import { VotacaoService } from './votacao/domain/votacao.service';
import { Pauta } from './votacao/persistence/pauta.entity';
import { SessaoVotacao } from './votacao/persistence/sessao-votacao.entity';
import { Usuario } from './votacao/persistence/usuario.entity';
import { Voto } from './votacao/persistence/voto.entity';

@Module({
  imports: [TypeOrmModule.forFeature([Pauta, SessaoVotacao, Usuario, Voto])],
  controllers: [VotacaoController],
  providers: [PautaService, UsuarioService, VotacaoService],
})
export class VotacaoModule {}
