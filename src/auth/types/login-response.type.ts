import { User } from '@users/domain/user';

export type LoginResponseType = Readonly<{
  refreshToken: string;
  token: string;
  tokenExpires: number;
  user: User;
}>;
