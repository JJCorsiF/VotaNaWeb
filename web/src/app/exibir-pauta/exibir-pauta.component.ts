import { HttpClient } from '@angular/common/http';
import { Component } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { ActivatedRoute, Router, RouterLink } from '@angular/router';

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

export interface ExibirPautaResponse {
  descricao: string;
  categoria: string;
  foiAprovada?: boolean;
  sessao?: {
    expirou: boolean;
    totalVotos: number;
  };
}

@Component({
  selector: 'exibir-pauta-component',
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
  templateUrl: './exibir-pauta.component.html',
  styleUrl: './exibir-pauta.component.css',
})
export class ExibirPautaComponent {
  id: string = '';

  pauta: ExibirPautaResponse | null = null;

  duracao: number = 1;

  constructor(
    private readonly activatedRoute: ActivatedRoute,
    private readonly http: HttpClient,
    private readonly router: Router
  ) {}

  ngOnInit() {
    const id = this.activatedRoute.snapshot.paramMap.get('id');

    if (!id) {
      this.router.navigate(['pautas']);
      return;
    }

    this.id = id;

    this.atualizarPauta();
  }

  abrirSessao() {
    this.http
      .post(`${SERVER_URL}/pautas/${this.id}/abrirSessao`, {
        duracao: this.duracao,
      })
      .subscribe({
        next: (response) => {
          console.log(response);
          this.atualizarPauta();
        },
        error: (error) => console.log('error: ', error),
      });
  }

  atualizarPauta() {
    this.http.get(`${SERVER_URL}/pautas/${this.id}`).subscribe({
      next: (response) => {
        this.pauta = response as ExibirPautaResponse;
      },
      error: (error) => console.log('error: ', error),
    });
  }

  sessaoExpirou() {
    return this.pauta?.sessao?.expirou;
  }

  sessaoFoiAberta() {
    return this.pauta?.sessao !== null;
  }
}
