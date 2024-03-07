import { FileType } from '@files/domain/file';
import { Role } from '@roles/domain/role';
import { Status } from '@statuses/domain/status';
import { Exclude, Expose } from 'class-transformer';

export class User {
  createdAt: Date;

  deletedAt: Date;

  @Expose({ groups: ['me', 'admin'] })
  email: null | string;

  firstName: null | string;

  id: number | string;

  lastName: null | string;
  @Exclude({ toPlainOnly: true })
  password?: string;
  photo?: FileType | null;
  @Exclude({ toPlainOnly: true })
  previousPassword?: string;
  @Expose({ groups: ['me', 'admin'] })
  provider: string;
  role?: null | Role;
  @Expose({ groups: ['me', 'admin'] })
  socialId?: null | string;
  status?: Status;
  updatedAt: Date;
}
