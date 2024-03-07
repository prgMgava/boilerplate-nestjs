import { User } from '@users/domain/user';

export class Session {
  createdAt: Date;
  deletedAt: Date;
  id: number | string;
  user: User;
}
