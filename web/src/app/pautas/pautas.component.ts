import { HttpClient } from '@angular/common/http';
import { Component } from '@angular/core';

import { SERVER_URL } from '../app.config';
import { SharedModule } from '../shared.module';

export interface Pauta {
  id: string;
  descricao: string;
  categoria: string;
  sessao: {
    expirou: boolean;
  };
}

@Component({
  selector: 'pautas-component',
  standalone: true,
  imports: [SharedModule],
  templateUrl: './pautas.component.html',
})
export class PautasComponent {
  filtroDescricao: string = '';
  mostrarApenasComSessaoAberta: boolean = false;

  pautas: Pauta[] = [];
  pautasFiltradas: Pauta[] = [];

  constructor(private readonly http: HttpClient) {}

  ngOnInit() {
    this.http.get(SERVER_URL + '/pautas').subscribe({
      next: (response) => {
        this.pautas = response as Pauta[];
        this.pautasFiltradas = this.pautas;
      },
      error: (error) => console.log('error: ', error),
    });
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
