import { Body, Controller, Get, Param, Post } from '@nestjs/common';

import { PautaService } from '../domain/pauta.service';
import { Sessao } from '../domain/sessao';

@Controller('pautas')
export class PautaController {
  constructor(private readonly pautaService: PautaService) {}

  @Post(':id/abrirSessao')
  async abrirSessao(@Param('id') id: string, @Body('duracao') duracao: number) {
    return await this.pautaService.abrirSessao(id, duracao);
  }

  @Post(':id/votar')
  async receberVoto(@Param('id') id: string, @Body() voto) {
    return await this.pautaService.receberVoto(id, voto);
  }

  @Get(':id')
  async exibir(@Param('id') id: string) {
    return await this.pautaService.exibir(id);
  }

  @Get()
  async listarTodas() {
    return (await this.pautaService.listarTodas()).map((pauta) => ({
      ...pauta,
      sessao: pauta.sessao
        ? {
            expirou: new Sessao(pauta.sessao.dataAbertura, pauta.sessao.duracao)
              .expirou,
          }
        : null,
    }));
  }

  @Post()
  async cadastrar(@Body() pauta) {
    return await this.pautaService.cadastrar(pauta);
  }
}
