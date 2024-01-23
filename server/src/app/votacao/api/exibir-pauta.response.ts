export interface ExibirPautaResponse {
  descricao: string;
  categoria: string;
  foiAprovada?: boolean;
  sessao: {
    expirou: boolean;
    totalVotos: number;
  };
}
