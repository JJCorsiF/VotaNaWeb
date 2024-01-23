import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';

import { PautaController } from './votacao/api/pauta.controller';
import { PautaService } from './votacao/domain/pauta.service';
import { Pauta } from './votacao/persistence/pauta.entity';
import { SessaoVotacao } from './votacao/persistence/sessao-votacao.entity';
import { Usuario } from './votacao/persistence/usuario.entity';
import { Voto } from './votacao/persistence/voto.entity';

@Module({
  imports: [TypeOrmModule.forFeature([Pauta, SessaoVotacao, Usuario, Voto])],
  controllers: [PautaController],
  providers: [PautaService],
})
export class PautaModule {}
