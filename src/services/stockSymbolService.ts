import { inject, injectable } from 'inversify';
import TYPES from '../constants/types';
import { ILoggerFactory } from '../logging/interfaces';
import ServiceBase, { IServiceBase } from './serviceBase';
import StockSymbol from './../models/stockSymbol';
import IStockSymbolRepository from './../repositories/stockSymbolRepository';
import { StockSymbolJoiSchema } from './../validations/stockSymbol';
import Result, { ValueResult } from '../models/result';
import { ERROR_CODES } from '../constants/const';

export interface IStockSymbolService extends IServiceBase<StockSymbol> {
  findByName(name: string): Promise<ValueResult<StockSymbol>>;
}

@injectable()
export default class StockSymbolService
  extends ServiceBase<StockSymbol, IStockSymbolRepository>
  implements IStockSymbolService
{
  constructor(
    @inject(TYPES.IStockSymbolRepository) repository: IStockSymbolRepository,
    @inject(TYPES.ILoggerFactory) loggerFactory: ILoggerFactory
  ) {
    super(repository, StockSymbolJoiSchema, StockSymbol, loggerFactory);
  }

  public async findByName(name: string): Promise<ValueResult<StockSymbol>> {
    try {
      const result = await this.repository.find({ id: name.toUpperCase() }, {}, {}, 1, 0);
      if (result.length == 0)
        return new ValueResult<StockSymbol>(
          null,
          true,
          'Symbol not found.',
          ERROR_CODES.SYMBOL_NOT_FOUND
        );
      else return Result.value(new StockSymbol(result[0]));
    } catch (error: any) {
      return Result.fail(error, ERROR_CODES.UNKNOWN);
    }
  }
}
