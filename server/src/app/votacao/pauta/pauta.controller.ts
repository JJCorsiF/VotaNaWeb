import { Body, Controller, Get, Post } from '@nestjs/common';

import { PautaService } from './pauta.service';

@Controller('pautas')
export class PautaController {
  constructor(private readonly pautaService: PautaService) {}

  @Get()
  async listarTodas() {
    return await this.pautaService.listarTodas();
  }

  @Post()
  async cadastrar(@Body() pauta) {
    return await this.pautaService.cadastrar(pauta);
  }
}
