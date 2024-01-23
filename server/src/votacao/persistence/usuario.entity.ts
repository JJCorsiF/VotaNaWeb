import { Column, Entity, OneToMany, PrimaryGeneratedColumn } from 'typeorm';

import { Voto } from './voto.entity';

@Entity()
export class Usuario {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column({ unique: true })
  cpf: string;

  @OneToMany(() => Voto, (voto) => voto.usuario)
  votos: Voto[];
}
