export type MailConfig = {
  defaultEmail?: string;
  defaultName?: string;
  host?: string;
  ignoreTLS: boolean;
  password?: string;
  port: number;
  requireTLS: boolean;
  secure: boolean;
  user?: string;
};
