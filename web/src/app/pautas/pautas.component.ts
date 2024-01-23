import { HttpClient } from '@angular/common/http';
import { Component } from '@angular/core';
import { RouterLink } from '@angular/router';

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

export interface Pauta {
  id: string;
  descricao: string;
  categoria: string;
}

@Component({
  selector: 'pautas-component',
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
  templateUrl: './pautas.component.html',
  styleUrl: './pautas.component.css',
})
export class PautasComponent {
  constructor(private readonly http: HttpClient) {}

  pautas: Pauta[] = [];

  ngOnInit() {
    this.http.get(SERVER_URL + '/pautas').subscribe({
      next: (response) => {
        this.pautas = response as Pauta[];
      },
      error: (error) => console.log('error: ', error),
    });
  }
}
