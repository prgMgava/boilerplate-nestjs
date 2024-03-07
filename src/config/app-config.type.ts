export type AppConfig = {
  apiPrefix: string;
  appLogFileName: string;
  backendDomain: string;
  fallbackLanguage: string;
  frontendDomain?: string;
  headerLanguage: string;
  name: string;
  nodeEnv: string;
  port: number;
  workingDirectory: string;
};
