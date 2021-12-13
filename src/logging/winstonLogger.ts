import { Logger } from 'winston';
import { ILogger } from './interfaces';

export class WinstonLogger implements ILogger {
  private logger: Logger;
  private namespace: string;

  constructor(namespace: string, logger: Logger) {
    this.logger = logger;
    this.namespace = namespace;
  }

  info = (message: string, ...meta: any): ILogger => {
    this.logger.log({
      level: 'info',
      logger: this.namespace,
      message: message,
      meta,
    });
    return this;
  };
  debug = (message: string, ...meta: any): ILogger => {
    this.logger.log({
      level: 'debug',
      logger: this.namespace,
      message: message,
      meta,
    });
    return this;
  };
  silly = (message: string, ...meta: any): ILogger => {
    this.logger.log({
      level: 'silly',
      logger: this.namespace,
      message: message,
      meta,
    });
    return this;
  };

  error = (message: string, ...meta: any): ILogger => {
    this.logger.log({
      level: 'error',
      logger: this.namespace,
      message: message,
      meta,
    });
    return this;
  };
  warn = (message: string, ...meta: any): ILogger => {
    this.logger.log({
      level: 'warn',
      logger: this.namespace,
      message: message,
      meta,
    });
    return this;
  };
}
