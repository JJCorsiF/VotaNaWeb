import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';

import { SERVER_URL } from '../app.config';

@Injectable({
  providedIn: 'root',
})
export class VotacaoService {
  constructor(private readonly http: HttpClient) {}

  abrirSessao(idPauta: string, duracao: number = 1) {
    return this.http.post(`${SERVER_URL}/pautas/${idPauta}/abrirSessao`, {
      duracao,
    });
  }

  buscarPauta(id: string) {
    return this.http.get(`${SERVER_URL}/pautas/${id}`);
  }

  buscarPautas() {
    return this.http.get(SERVER_URL + '/pautas');
  }

  cadastrarPauta(descricao: string, categoria: string) {
    return this.http.post(SERVER_URL + '/pautas', {
      descricao,
      categoria,
    });
  }

  votar(idPauta: string, cpf: string, voto: string) {
    return this.http.post(`${SERVER_URL}/pautas/${idPauta}/votar`, {
      cpf,
      voto,
    });
  }
}
