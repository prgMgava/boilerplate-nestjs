import {
  CreateDateColumn,
  DeleteDateColumn,
  Entity,
  Index,
  ManyToOne,
  PrimaryGeneratedColumn,
} from 'typeorm';

import { EntityRelationalHelper } from '@utils/relational-entity-helper';

import { UserEntity } from '../../../../../users/infrastructure/persistence/relational/entities/user.entity';
import { Session } from '../../../../domain/session';

@Entity({
  name: 'session',
})
export class SessionEntity extends EntityRelationalHelper implements Session {
  @CreateDateColumn()
  createdAt: Date;

  @DeleteDateColumn()
  deletedAt: Date;

  @PrimaryGeneratedColumn()
  id: number | string;

  @ManyToOne(() => UserEntity, {
    eager: true,
  })
  @Index()
  user: UserEntity;
}
