import { Component } from '@angular/core';
import { Subscription } from 'rxjs';

import { Pauta } from '../shared/pauta';
import { SharedModule } from '../shared/shared.module';
import { VotacaoService } from '../shared/votacao.service';

@Component({
  selector: 'listar-pautas-page',
  standalone: true,
  imports: [SharedModule],
  templateUrl: './listar-pautas.component.html',
})
export class ListarPautasComponent {
  filtroDescricao: string = '';
  mostrarApenasComSessaoAberta: boolean = false;

  pautas: Pauta[] = [];
  pautasFiltradas: Pauta[] = [];

  subscriptions: Subscription[] = [];

  constructor(private readonly votacaoService: VotacaoService) {}

  ngOnInit() {
    const subscription = this.votacaoService.buscarPautas().subscribe({
      next: (response) => {
        this.pautas = response as Pauta[];
        this.pautasFiltradas = this.pautas;
      },
      error: (error) => console.log('error: ', error),
    });

    this.subscriptions.push(subscription);
  }

  ngOnDestroy() {
    this.subscriptions.forEach((sub) => sub.unsubscribe());
    this.subscriptions = [];
  }

  atualizarPautas() {
    if (this.mostrarApenasComSessaoAberta) {
      this.pautasFiltradas = this.pautas.filter(
        (pauta) => pauta.sessao !== null && !pauta.sessao.expirou
      );
    } else {
      this.pautasFiltradas = this.pautas;
    }

    this.pautasFiltradas = this.pautasFiltradas.filter((pauta) =>
      pauta.categoria.toLowerCase().includes(this.filtroDescricao.toLowerCase())
    );
  }
}
