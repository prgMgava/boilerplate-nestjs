import { Session } from '@session/domain/session';
import { User } from '@users/domain/user';

export type JwtPayloadType = Pick<User, 'id' | 'role'> & {
  exp: number;
  iat: number;
  sessionId: Session['id'];
};
