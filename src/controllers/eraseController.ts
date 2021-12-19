import { inject, injectable } from 'inversify';
import { ILogger, ILoggerFactory } from '../logging/interfaces';
import { ITradeService } from '../services/tradeService';
import { HttpResults } from '../models/httpResult';
import TYPES from '../constants/types';
import { HttpResult } from './../models/httpResult';
import { IStockSymbolService } from './../services/stockSymbolService';
import { IUserService } from '../services/userService';

export interface IEraseController {
  erase(): Promise<HttpResult>;
}

@injectable()
export default class EraseController implements IEraseController {
  private logger: ILogger;

  constructor(
    @inject(TYPES.ITradeService) private readonly tradeService: ITradeService,
    @inject(TYPES.IUserService) private readonly userService: IUserService,
    @inject(TYPES.IStockSymbolService) private readonly symbolService: IStockSymbolService,
    @inject(TYPES.ILoggerFactory) loggerFactory: ILoggerFactory
  ) {
    this.logger = loggerFactory.create(EraseController.name);
  }
  public async erase(): Promise<HttpResult> {
    const ops = [
      this.tradeService.eraseAll(),
      this.userService.eraseAll(),
      this.symbolService.eraseAll(),
    ];
    const results = await Promise.all(ops);
    const failed_results = results.filter((x) => !x.isSuccess);
    if (failed_results.length > 0) {
      this.logger.error(failed_results.map((x) => x.message).join(' '));
      return HttpResults.internal_server_error();
    }
    return HttpResults.ok();
  }
}
