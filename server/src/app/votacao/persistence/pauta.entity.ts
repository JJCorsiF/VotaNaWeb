import { Column, Entity, OneToOne, PrimaryGeneratedColumn } from 'typeorm';

import { SessaoVotacao } from './sessao-votacao.entity';

@Entity()
export class Pauta {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column('text')
  descricao: string;

  @Column()
  categoria: string;

  @OneToOne(() => SessaoVotacao, (sessao) => sessao.pauta)
  sessao: SessaoVotacao;
}
