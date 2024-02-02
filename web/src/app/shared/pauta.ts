export interface Pauta {
  id: string;
  descricao: string;
  categoria: string;
  sessao: {
    expirou: boolean;
  };
}
