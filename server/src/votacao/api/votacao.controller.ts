import { Body, Controller, Get, Param, Post } from '@nestjs/common';

import { Sessao } from '../domain/sessao';
import { VotacaoService } from '../domain/votacao.service';

@Controller('pautas')
export class VotacaoController {
  constructor(private readonly votacaoService: VotacaoService) {}

  @Post(':id/abrirSessao')
  async abrirSessao(@Param('id') id: string, @Body('duracao') duracao: number) {
    return await this.votacaoService.abrirSessao(id, duracao);
  }

  @Post(':id/votar')
  async receberVoto(@Param('id') id: string, @Body() voto) {
    return await this.votacaoService.receberVoto(id, voto);
  }

  @Get(':id')
  async exibirPauta(@Param('id') id: string) {
    return await this.votacaoService.exibirPauta(id);
  }

  @Get()
  async listarPautas() {
    return (await this.votacaoService.listarPautas()).map((pauta) => ({
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
  async cadastrarPauta(@Body() pauta) {
    return await this.votacaoService.cadastrarPauta(pauta);
  }
}
