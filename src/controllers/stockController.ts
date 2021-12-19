import { inject, injectable } from 'inversify';
import { ILogger, ILoggerFactory } from '../logging/interfaces';
import { FluctuationElement } from '../models/fluctuation';
import SymbolRange from '../models/symbolRange';
import { ITradeService } from './../services/tradeService';
import { HttpResults, HttpValueResult } from './../models/httpResult';
import TYPES from '../constants/types';
import { ERROR_CODES } from '../constants/const';
import Message from '../models/message';

export interface IStockController {
  getStats(start: string, end: string): Promise<HttpValueResult<FluctuationElement[]>>;
  getPrice(
    symbol: string,
    start: string,
    end: string
  ): Promise<HttpValueResult<SymbolRange | Message>>;
}

@injectable()
export default class StockController implements IStockController {
  private tradeService: ITradeService;
  private logger: ILogger;

  constructor(
    @inject(TYPES.ITradeService) tradeService: ITradeService,
    @inject(TYPES.ILoggerFactory) loggerFactory: ILoggerFactory
  ) {
    this.tradeService = tradeService;
    this.logger = loggerFactory.create(StockController.name);
  }

  // Returning the fluctuations count, maximum daily rise and maximum daily fall for each
  // stock symbol for the period in the given date range: The service returns
  // the fluctuations count, maximum daily rise and maximum daily fall for each stock symbol
  // for the period in the given date range inclusive.
  getStats = async (start: string, end: string): Promise<HttpValueResult<FluctuationElement[]>> => {
    const result = await this.tradeService.getStats(new Date(start), new Date(end));
    if (!result.isSuccess) {
      return HttpResults.internal_server_error_value(result.value);
    }
    return HttpResults.ok_value(result.value);
  };

  // Returning the highest and lowest price for the stock symbol in the given date range.
  // The service returns the JSON object describing the information of highest
  // and lowest price in the given date range specified by start date and end date inclusive
  getPrice = async (
    symbol: string,
    start: string,
    end: string
  ): Promise<HttpValueResult<SymbolRange | Message>> => {
    const result = await this.tradeService.findRange(symbol, new Date(start), new Date(end));
    if (!result.isSuccess) {
      if (result.errorCode == ERROR_CODES.SYMBOL_NOT_FOUND) {
        return HttpResults.not_found_value(result.value);
      } else if (result.errorCode == ERROR_CODES.NO_DATA) {
        return HttpResults.ok_value(new Message(result.message));
      } else {
        return HttpResults.internal_server_error_value(result.value);
      }
    }
    return HttpResults.ok_value(result.value);
  };
}
