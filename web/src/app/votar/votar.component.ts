import { Component } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { Subscription } from 'rxjs';

import { ExibirPautaResponse } from '../shared/exibir-pauta.response';
import { SharedModule } from '../shared/shared.module';
import { VotacaoService } from '../shared/votacao.service';

@Component({
  selector: 'votar-page',
  standalone: true,
  imports: [SharedModule],
  templateUrl: './votar.component.html',
})
export class VotarComponent {
  id: string = '';

  pauta: ExibirPautaResponse | null = null;

  cpf: string = '';

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

  atualizarPauta() {
    const subscription = this.votacaoService.buscarPauta(this.id).subscribe({
      next: (response) => {
        this.pauta = response as ExibirPautaResponse;

        if (!this.pauta.sessao) {
          this.router.navigate(['pautas', this.id]);
        }
      },
      error: (error) => console.log('error: ', error),
    });

    this.subscriptions.push(subscription);
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

    const subscription = this.votacaoService
      .votar(this.id, this.cpf, voto)
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

    this.subscriptions.push(subscription);
  }
}
