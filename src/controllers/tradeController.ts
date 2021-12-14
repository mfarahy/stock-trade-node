import Trade from '../models/trade';
import Result, { OperationResult, ValueResult } from '../models/result';
import { inject, injectable } from 'inversify';
import SymbolRange from '../models/symbolRange';
import { ITradeService } from '../services/tradeService';
import { HttpResult, HttpResults, HttpValueResult } from '../models/httpResult';
import TYPES from '../constants/types';
import StatusCodes from 'http-status-codes';
import _ from 'lodash';
import { Model, model, Models } from 'mongoose';
import { string } from 'joi';
import { join } from 'path';

export interface ITradeController {
  add(trade: Trade): Promise<HttpResult>;
  eraseAll(): Promise<HttpResult>;
  getAll(trade: Trade): Promise<HttpValueResult<Trade[]>>;
  findById(userId: number): Promise<ValueResult<Trade[]>>;
}

@injectable()
export default class TradeController implements ITradeController {
  private service: ITradeService;

  constructor(@inject(TYPES.ITradeService) service: ITradeService) {
    this.service = service;
  }

  add = async (trade: Trade): Promise<HttpResult> => {
    var result = await this.service.add(trade);
    if (result.isSuccess) {
      return HttpResults.created();
    } else {
      return HttpResults.bad_request();
    }
  };

  // Erasing all the trades
  eraseAll = async (): Promise<HttpResult> => {
    var result = await this.service.eraseAll();
    if (result.isSuccess) {
      return HttpResults.ok();
    } else {
      return HttpResults.internal_server_error();
    }
  };

  getAll = async (): Promise<HttpValueResult<Trade[]>> => {
    const result = await this.service.getAll();
    if (result.isSuccess) {
      for (let i = 0; i < result.value.length; ++i) {
        if (result.value[i].timestamp) {
          var date = result.value[i].timestamp.toISOString().split(/[T.]/);
          Object.assign(result.value[i], { timestamp: date[0] + ' ' + date[1] });
        }
      }

      return HttpResults.ok_value(result.value);
    } else return new HttpValueResult(StatusCodes.INTERNAL_SERVER_ERROR, []);
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
