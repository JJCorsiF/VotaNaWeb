import { HttpClient } from '@angular/common/http';
import { Component } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { RouterLink } from '@angular/router';

import { HlmButtonDirective } from '@spartan-ng/ui-button-helm';
import {
  HlmCardContentDirective,
  HlmCardDescriptionDirective,
  HlmCardDirective,
  HlmCardFooterDirective,
  HlmCardHeaderDirective,
  HlmCardTitleDirective,
} from '@spartan-ng/ui-card-helm';
import { HlmInputDirective } from '@spartan-ng/ui-input-helm';
import { HlmLabelDirective } from '@spartan-ng/ui-label-helm';
import { SERVER_URL } from '../app.config';

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
  imports: [
    FormsModule,
    HlmButtonDirective,
    HlmCardContentDirective,
    HlmCardDescriptionDirective,
    HlmCardDirective,
    HlmCardFooterDirective,
    HlmCardHeaderDirective,
    HlmCardTitleDirective,
    HlmInputDirective,
    HlmLabelDirective,
    RouterLink,
  ],
  templateUrl: './pautas.component.html',
  styleUrl: './pautas.component.css',
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
