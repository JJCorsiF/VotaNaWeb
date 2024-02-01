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
import { ExibirPautaResponse } from '../exibir-pauta/exibir-pauta.component';

@Component({
  selector: 'votar-component',
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
  templateUrl: './votar.component.html',
})
export class VotarComponent {
  id: string = '';

  pauta: ExibirPautaResponse | null = null;

  cpf: string = '';

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

  atualizarPauta() {
    this.http.get(`${SERVER_URL}/pautas/${this.id}`).subscribe({
      next: (response) => {
        this.pauta = response as ExibirPautaResponse;

        if (!this.pauta.sessao) {
          this.router.navigate(['pautas', this.id]);
        }
      },
      error: (error) => console.log('error: ', error),
    });
  }

  votarAFavor() {
    this.votar('Sim');
  }

  votarContra() {
    this.votar('Não');
  }

  sessaoExpirou() {
    return this.pauta?.sessao?.expirou;
  }

  private votar(voto: string) {
    if (!this.cpf) {
      return;
    }

    this.http
      .post(`${SERVER_URL}/pautas/${this.id}/votar`, {
        cpf: this.cpf,
        voto,
      })
      .subscribe({
        next: (response) => {
          console.log(response);
          this.router.navigate(['pautas', this.id]);
        },
        error: (error) => {
          console.log('error: ', error);
          this.router.navigate(['pautas', this.id]);
        },
      });
  }
}
