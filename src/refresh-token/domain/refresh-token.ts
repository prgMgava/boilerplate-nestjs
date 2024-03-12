export class RefreshToken {
  browser?: string;

  createdAt: Date;

  deletedAt: Date;

  expires: Date;

  id: number | string;

  ip?: string;

  isRevoked?: boolean;

  os?: string;

  updatedAt: Date;

  userAgent?: string;
  userId: number;
}
