declare global {
  namespace NodeJS {
    interface ProcessEnv {
      NODE_ENV: 'development' | 'production';
      PORT?: string;
      MONGODB_CONNECTION_STRING: string;
      HOST: string;
      LOG_LEVEL: string;
      LOG_NAMESPACES: string;
      APP_NAME: string;
      NO_LOGS?: string;
    }
  }
}
export {};
