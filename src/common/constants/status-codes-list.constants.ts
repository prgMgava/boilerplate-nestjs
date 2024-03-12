export const StatusCodesList = {
  BadRequest: 1013,
  DeleteDefaultError: 1018,
  Forbidden: 1010,
  IncorrectOldPassword: 1011,
  InternalServerError: 1003,
  InvalidCredentials: 1014,
  InvalidRefreshToken: 1015,
  NotFound: 1004,
  OtpRequired: 1017,
  RefreshTokenExpired: 1019,
  ServiceUnAvailable: 1008,
  Success: 1001,
  ThrottleError: 1009,
  TokenExpired: 1006,
  TooManyTries: 1007,
  UnauthorizedAccess: 1005,
  UnsupportedFileType: 1016,
  UserInactive: 1012,
  ValidationError: 1002,
  UnprocessableEntity: 1019,
} as const;
