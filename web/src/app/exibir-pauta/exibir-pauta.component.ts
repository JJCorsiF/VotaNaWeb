import { HttpClient } from '@angular/common/http';
import { Component } from '@angular/core';
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
import { SERVER_URL } from '../app.config';

interface ExibirPautaResponse {
  descricao: string;
  categoria: string;
  foiAprovada?: boolean;
  sessao: {
    expirou: boolean;
    totalVotos: number;
  };
}

@Component({
  selector: 'app-exibir-pauta',
  standalone: true,
  imports: [
    HlmButtonDirective,
    HlmCardContentDirective,
    HlmCardDescriptionDirective,
    HlmCardDirective,
    HlmCardFooterDirective,
    HlmCardHeaderDirective,
    HlmCardTitleDirective,
    RouterLink,
  ],
  templateUrl: './exibir-pauta.component.html',
  styleUrl: './exibir-pauta.component.css',
})
export class ExibirPautaComponent {
  id: string = '';

  pauta: ExibirPautaResponse | null = null;

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

    this.http.get(`${SERVER_URL}/pautas/${id}`).subscribe({
      next: (response) => {
        this.pauta = response as ExibirPautaResponse;
      },
      error: (error) => console.log('error: ', error),
    });
  }
}
