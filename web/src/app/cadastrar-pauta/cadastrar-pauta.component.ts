import { HttpClient } from '@angular/common/http';
import { Component } from '@angular/core';
import { Router } from '@angular/router';

import { SERVER_URL } from '../app.config';
import { Pauta } from '../pautas/pautas.component';
import { SharedModule } from '../shared.module';

@Component({
  selector: 'cadastrar-pauta-component',
  standalone: true,
  imports: [SharedModule],
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
