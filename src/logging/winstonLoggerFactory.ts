import winston, { Logger } from 'winston';
import { ILoggerFactory, ILogger } from './interfaces';
import { WinstonLogger } from './winstonLogger';
import { inject, injectable } from 'inversify';
import TYPES from '../constants/types';

@injectable()
export class WinstonLoggerFactory implements ILoggerFactory {
  private logger: Logger;

  constructor(@inject(TYPES.Logger) logger: Logger) {
    this.logger = logger;
  }

  public create = (namespace: string): ILogger => {
    return new WinstonLogger('app:' + namespace, this.logger);
  };
}
