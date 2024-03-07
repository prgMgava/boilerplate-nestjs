export type DatabaseConfig = {
  ca?: string;
  cert?: string;
  host?: string;
  isDocumentDatabase: boolean;
  key?: string;
  maxConnections: number;
  name?: string;
  password?: string;
  port?: number;
  rejectUnauthorized?: boolean;
  sslEnabled?: boolean;
  synchronize?: boolean;
  type?: string;
  url?: string;
  username?: string;
};
