import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';

import { Pauta } from '../persistence/pauta.entity';
import { PautaController } from './pauta.controller';
import { PautaService } from './pauta.service';

@Module({
  imports: [TypeOrmModule.forFeature([Pauta])],
  controllers: [PautaController],
  providers: [PautaService],
})
export class PautaModule {}
