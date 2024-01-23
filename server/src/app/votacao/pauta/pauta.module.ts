import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';

import { Pauta } from '../persistence/pauta.entity';
import { SessaoVotacao } from '../persistence/sessao-votacao.entity';
import { PautaController } from './pauta.controller';
import { PautaService } from './pauta.service';

@Module({
  imports: [TypeOrmModule.forFeature([Pauta, SessaoVotacao])],
  controllers: [PautaController],
  providers: [PautaService],
})
export class PautaModule {}
