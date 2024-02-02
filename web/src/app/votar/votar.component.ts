import { HttpClient } from '@angular/common/http';
import { Component } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';

import { SERVER_URL } from '../app.config';
import { ExibirPautaResponse } from '../exibir-pauta/exibir-pauta.component';
import { SharedModule } from '../shared.module';

@Component({
  selector: 'votar-component',
  standalone: true,
  imports: [SharedModule],
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
