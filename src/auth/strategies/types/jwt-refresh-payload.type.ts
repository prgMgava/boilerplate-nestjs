import { Session } from '@session/domain/session';

export type JwtRefreshPayloadType = {
  exp: number;
  iat: number;
  sessionId: Session['id'];
};
