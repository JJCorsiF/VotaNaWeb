import { HttpClient } from '@angular/common/http';
import { Component } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';

import { SERVER_URL } from '../app.config';
import { SharedModule } from '../shared.module';

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
  imports: [SharedModule],
  templateUrl: './exibir-pauta.component.html',
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
