export interface ILogger {
  info: (message: string, ...meta: any) => ILogger;
  debug: (message: string, ...meta: any) => ILogger;
  warn: (message: string, ...meta: any) => ILogger;
  error: (message: string, ...meta: any) => ILogger;
  silly: (message: string, ...meta: any) => ILogger;
}

export interface ILoggerFactory {
  create: (namespace: string) => ILogger;
}
