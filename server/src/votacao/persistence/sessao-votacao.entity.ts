import {
  Column,
  Entity,
  JoinColumn,
  OneToMany,
  OneToOne,
  PrimaryGeneratedColumn,
} from 'typeorm';

import { Pauta } from './pauta.entity';
import { Voto } from './voto.entity';

@Entity()
export class SessaoVotacao {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column('integer', { default: 60 })
  duracao: number;

  @Column('timestamptz')
  dataAbertura: Date;

  @Column({ nullable: true })
  resultado?: string;

  @OneToOne(() => Pauta, (pauta) => pauta.sessao)
  @JoinColumn()
  pauta: Pauta;

  @OneToMany(() => Voto, (voto) => voto.sessao)
  votos: Voto[];
}
