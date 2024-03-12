export type AuthConfig = {
  confirmEmailExpires?: string;
  confirmEmailSecret?: string;
  expires?: string;
  forgotExpires?: string;
  forgotSecret?: string;
  refreshExpires?: string;
  refreshSecret?: string;
  secret?: string;
  cookieExpires?: string;
  isSameSite?: boolean;
};
