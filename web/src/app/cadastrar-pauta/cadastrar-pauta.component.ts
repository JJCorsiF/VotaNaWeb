import { Component, OnDestroy } from '@angular/core';
import { Router } from '@angular/router';
import { Subscription } from 'rxjs';

import { Pauta } from '../shared/pauta';
import { SharedModule } from '../shared/shared.module';
import { VotacaoService } from '../shared/votacao.service';

@Component({
  selector: 'cadastrar-pauta-page',
  standalone: true,
  imports: [SharedModule],
  templateUrl: './cadastrar-pauta.component.html',
})
export class CadastrarPautaComponent implements OnDestroy {
  descricao: string = '';
  categoria: string = '';

  abrirSessao: boolean = false;

  duracao: number = 1;

  subscriptions: Subscription[] = [];

  constructor(
    private readonly router: Router,
    private readonly votacaoService: VotacaoService
  ) {}

  ngOnDestroy() {
    this.subscriptions.forEach((sub) => sub.unsubscribe());
    this.subscriptions = [];
  }

  cadastrar() {
    if (!this.descricao || !this.categoria) {
      return;
    }

    const subscription = this.votacaoService
      .cadastrarPauta(this.descricao, this.categoria)
      .subscribe({
        next: (response) => {
          console.log(response);

          if (this.abrirSessao) {
            const { id } = response as Pauta;
            this.votacaoService.abrirSessao(id, this.duracao).subscribe({
              next: (response) => {
                console.log(response);
              },
              error: (error) => console.log('error: ', error),
            });
          }

          this.router.navigate(['pautas']);
        },
        error: (error) => console.log('error: ', error),
      });

    this.subscriptions.push(subscription);
  }
}
