import { HttpClient } from '@angular/common/http';
import { Component } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { Router } from '@angular/router';

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

@Component({
  selector: 'cadastrar-pauta-component',
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
  ],
  templateUrl: './cadastrar-pauta.component.html',
  styleUrl: './cadastrar-pauta.component.css',
})
export class CadastrarPautaComponent {
  descricao: string = '';
  categoria: string = '';

  constructor(
    private readonly http: HttpClient,
    private readonly router: Router
  ) {}

  cadastrar() {
    this.http
      .post(SERVER_URL + '/pautas', {
        descricao: this.descricao,
        categoria: this.categoria,
      })
      .subscribe(
        (response) => {
          console.log(response);
          this.router.navigate(['pautas']);
        },
        (error) => console.log('error: ', error)
      );
  }
}
