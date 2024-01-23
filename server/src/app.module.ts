import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';

import { configService } from 'src/config.service';
import { PautaModule } from './pauta.module';

@Module({
  imports: [TypeOrmModule.forRoot(configService.dbConfig), PautaModule],
  controllers: [],
  providers: [],
})
export class AppModule {}
