import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';

import { configService } from 'src/config.service';
import { VotacaoModule } from './votacao.module';

@Module({
  imports: [TypeOrmModule.forRoot(configService.dbConfig), VotacaoModule],
  controllers: [],
  providers: [],
})
export class AppModule {}
