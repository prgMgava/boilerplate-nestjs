// We use class-transformer in ORM entity and domain entity.
import { AuthProvidersEnum } from '@auth/auth-providers.enum';
import { EntityRelationalHelper } from '@utils/relational-entity-helper';
// We duplicate these rules because you can choose not to use adapters
import { Exclude, Expose } from 'class-transformer';
import {
  AfterLoad,
  Column,
  CreateDateColumn,
  DeleteDateColumn,
  Entity,
  Index,
  ManyToOne,
  PrimaryGeneratedColumn,
  UpdateDateColumn,
} from 'typeorm';

// in your project and return an ORM entity directly in response.
import { FileEntity } from '../../../../../files/infrastructure/persistence/relational/entities/file.entity';
import { RoleEntity } from '../../../../../roles/infrastructure/persistence/relational/entities/role.entity';
import { StatusEntity } from '../../../../../statuses/infrastructure/persistence/relational/entities/status.entity';
import { User } from '../../../../domain/user';

@Entity({
  name: 'user',
})
export class UserEntity extends EntityRelationalHelper implements User {
  @CreateDateColumn()
  createdAt: Date;

  // For "string | null" we need to use String type.
  @DeleteDateColumn()
  deletedAt: Date;

  // More info: https://github.com/typeorm/typeorm/issues/2567
  @Column({ nullable: true, type: String, unique: true })
  @Expose({ groups: ['me', 'admin'] })
  email: null | string;

  @Index()
  @Column({ nullable: true, type: String })
  firstName: null | string;

  @PrimaryGeneratedColumn()
  id: number;

  @Index()
  @Column({ nullable: true, type: String })
  lastName: null | string;

  @Column({ nullable: true })
  @Exclude({ toPlainOnly: true })
  password?: string;

  @ManyToOne(() => FileEntity, {
    eager: true,
  })
  photo?: FileEntity | null;

  @Exclude({ toPlainOnly: true })
  public previousPassword?: string;

  @Column({ default: AuthProvidersEnum.email })
  @Expose({ groups: ['me', 'admin'] })
  provider: string;

  @ManyToOne(() => RoleEntity, {
    eager: true,
  })
  role?: null | RoleEntity;

  @Index()
  @Column({ nullable: true, type: String })
  @Expose({ groups: ['me', 'admin'] })
  socialId?: null | string;

  @ManyToOne(() => StatusEntity, {
    eager: true,
  })
  status?: StatusEntity;

  @UpdateDateColumn()
  updatedAt: Date;

  @AfterLoad()
  public loadPreviousPassword(): void {
    this.previousPassword = this.password;
  }
}
