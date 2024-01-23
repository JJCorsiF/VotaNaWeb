import { Body, Controller, Get, Param, Post } from '@nestjs/common';

import { PautaService } from './pauta.service';

@Controller('pautas')
export class PautaController {
  constructor(private readonly pautaService: PautaService) {}

  @Post(':id/abrirSessao')
  async abrirSessao(@Param('id') id: string, @Body('duracao') duracao: number) {
    return await this.pautaService.abrirSessao(id, duracao);
  }

  @Get()
  async listarTodas() {
    return await this.pautaService.listarTodas();
  }

  @Post()
  async cadastrar(@Body() pauta) {
    return await this.pautaService.cadastrar(pauta);
  }
}
