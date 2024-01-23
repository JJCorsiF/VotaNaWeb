import { Routes } from '@angular/router';
import { CadastrarPautaComponent } from './cadastrar-pauta/cadastrar-pauta.component';
import { ExibirPautaComponent } from './exibir-pauta/exibir-pauta.component';
import { PautasComponent } from './pautas/pautas.component';

export const routes: Routes = [
  {
    path: 'pautas/criar',
    component: CadastrarPautaComponent,
  },
  {
    path: 'pautas/:id',
    component: ExibirPautaComponent,
  },
  {
    path: 'pautas',
    component: PautasComponent,
  },
  {
    path: '',
    redirectTo: '/pautas',
    pathMatch: 'full',
  },
];
