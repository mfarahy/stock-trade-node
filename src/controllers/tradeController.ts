import Trade from '../models/trade';
import Result, { OperationResult, ValueResult } from '../models/result';
import { inject, injectable } from 'inversify';
import SymbolRange from '../models/symbolRange';
import { ITradeService } from '../services/tradeService';
import { HttpResult, HttpResults } from '../models/httpResult';
import TYPE_IDENTIFIER from '../constants/typeIdentifier';

export interface ITradeController {
  add(trade: Trade): Promise<HttpResult>;
  eraseAll(): Promise<OperationResult>;
  getAll(trade: Trade): Promise<ValueResult<Trade[]>>;
  findById(userId: number): Promise<ValueResult<Trade[]>>;
}

@injectable()
export default class TradeController implements ITradeController {
  private service: ITradeService;

  constructor(@inject(TYPE_IDENTIFIER.ITradeService) service: ITradeService) {
    this.service = service;
  }

  add = async (trade: Trade): Promise<HttpResult> => {
    return HttpResults.created();
    // var result = await this.service.add(trade);
    // if (result.isSuccess) {
    //   return HttpResults.created();
    // } else {
    //   return HttpResults.bad_request();
    // }
  };

  // Erasing all the trades
  eraseAll = async (): Promise<OperationResult> => {
    return Result.ok();
  };

  getAll = async (): Promise<ValueResult<Trade[]>> => {
    return Result.value([]);
  };

  findById = async (userId: number): Promise<ValueResult<Trade[]>> => {
    return Result.value([]);
  };

  getMinMaxPrice = async (
    symbol: string,
    start: Date,
    end: Date
  ): Promise<ValueResult<SymbolRange>> => {
    return Result.value(new SymbolRange());
  };
}
