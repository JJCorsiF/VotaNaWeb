import { Component, OnDestroy, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { Subscription } from 'rxjs';

import { ExibirPautaResponse } from '../shared/exibir-pauta.response';
import { SharedModule } from '../shared/shared.module';
import { VotacaoService } from '../shared/votacao.service';

@Component({
  selector: 'exibir-pauta-page',
  standalone: true,
  imports: [SharedModule],
  templateUrl: './exibir-pauta.component.html',
})
export class ExibirPautaComponent implements OnInit, OnDestroy {
  id: string = '';

  pauta: ExibirPautaResponse | null = null;

  duracao: number = 1;

  subscriptions: Subscription[] = [];

  constructor(
    private readonly activatedRoute: ActivatedRoute,
    private readonly router: Router,
    private readonly votacaoService: VotacaoService
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

  ngOnDestroy() {
    this.subscriptions.forEach((sub) => sub.unsubscribe());
    this.subscriptions = [];
  }

  abrirSessao() {
    const subscription = this.votacaoService
      .abrirSessao(this.id, this.duracao)
      .subscribe({
        next: (response) => {
          console.log(response);
          this.atualizarPauta();
        },
        error: (error) => console.log('error: ', error),
      });

    this.subscriptions.push(subscription);
  }

  atualizarPauta() {
    const subscription = this.votacaoService.buscarPauta(this.id).subscribe({
      next: (response) => {
        this.pauta = response as ExibirPautaResponse;
      },
      error: (error) => console.log('error: ', error),
    });

    this.subscriptions.push(subscription);
  }

  sessaoExpirou() {
    return this.pauta?.sessao?.expirou;
  }

  sessaoFoiAberta() {
    return this.pauta?.sessao !== null;
  }
}
