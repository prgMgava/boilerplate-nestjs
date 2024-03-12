import { RefreshToken } from 'src/refresh-token/domain/refresh-token';
import {
  Column,
  CreateDateColumn,
  DeleteDateColumn,
  Entity,
  Index,
  PrimaryGeneratedColumn,
  UpdateDateColumn,
} from 'typeorm';

import { EntityRelationalHelper } from '@utils/relational-entity-helper';

@Entity({
  name: 'refresh_token',
})
export class RefreshTokenEntity
  extends EntityRelationalHelper
  implements RefreshToken
{
  @Index()
  @Column({
    nullable: true,
  })
  browser?: string;

  @CreateDateColumn()
  createdAt: Date;

  // For "string | null" we need to use String type.
  @DeleteDateColumn()
  deletedAt: Date;

  @Column()
  expires: Date;

  @PrimaryGeneratedColumn()
  id: number;

  @Column()
  ip?: string;

  @Column()
  isRevoked?: boolean;

  @Index()
  @Column({
    nullable: true,
  })
  os?: string;

  @UpdateDateColumn()
  updatedAt: Date;

  @Column({
    nullable: true,
  })
  userAgent?: string;

  @Column()
  userId: number;
}
