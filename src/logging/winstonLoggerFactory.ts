import winston, { Logger } from 'winston';
import { ILoggerFactory, ILogger } from './interfaces';
import { WinstonLogger } from './winstonLogger';
import { injectable } from 'inversify';

@injectable()
export class WinstonLoggerFactory implements ILoggerFactory {
  private logger: Logger;

  constructor(logger: Logger) {
    this.logger = logger;
  }

  public create = (namespace: string): ILogger => {
    return new WinstonLogger('app:' + namespace, this.logger);
  };
}
