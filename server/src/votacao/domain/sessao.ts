export class Sessao {
  constructor(
    private readonly dataAbertura: Date,
    private readonly duracao: number,
  ) {}

  get foiAberta(): boolean {
    return this.dataAbertura !== null;
  }

  get expirou(): boolean {
    return (
      this.foiAberta &&
      this.dataAbertura.getTime() + 1000 * this.duracao < new Date().getTime()
    );
  }
}
