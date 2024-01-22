import {
  Column,
  Entity,
  Index,
  ManyToOne,
  PrimaryGeneratedColumn,
} from 'typeorm';

import { SessaoVotacao } from './sessao-votacao.entity';
import { Usuario } from './usuario.entity';

@Entity()
@Index('sessao_usuario_unique_key', ['sessao', 'usuario'], {
  unique: true,
})
export class Voto {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column()
  voto: string;

  @ManyToOne(() => SessaoVotacao, (sessao) => sessao.votos)
  sessao: SessaoVotacao;

  @ManyToOne(() => Usuario, (usuario) => usuario.votos)
  usuario: Usuario;
}
