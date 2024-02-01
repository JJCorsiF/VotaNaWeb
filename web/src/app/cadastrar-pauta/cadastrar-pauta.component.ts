import { HttpClient } from '@angular/common/http';
import { Component } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { Router } from '@angular/router';

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
import { Pauta } from '../pautas/pautas.component';

@Component({
  selector: 'cadastrar-pauta-component',
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
  ],
  templateUrl: './cadastrar-pauta.component.html',
})
export class CadastrarPautaComponent {
  descricao: string = '';
  categoria: string = '';

  abrirSessao: boolean = false;

  duracao: number = 1;

  constructor(
    private readonly http: HttpClient,
    private readonly router: Router
  ) {}

  cadastrar() {
    if (!this.descricao || !this.categoria) {
      return;
    }

    this.http
      .post(SERVER_URL + '/pautas', {
        descricao: this.descricao,
        categoria: this.categoria,
      })
      .subscribe({
        next: (response) => {
          console.log(response);

          if (this.abrirSessao) {
            const { id } = response as Pauta;
            this.abrirNovaSessao(id);
          }

          this.router.navigate(['pautas']);
        },
        error: (error) => console.log('error: ', error),
      });
  }

  private abrirNovaSessao(id: string) {
    this.http
      .post(`${SERVER_URL}/pautas/${id}/abrirSessao`, {
        duracao: this.duracao,
      })
      .subscribe({
        next: (response) => {
          console.log(response);
        },
        error: (error) => console.log('error: ', error),
      });
  }
}
