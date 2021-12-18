import Trade from '../models/trade';
import Result, { ValueResult } from '../models/result';
import { inject, injectable } from 'inversify';
import SymbolRange from '../models/symbolRange';
import { ITradeService } from '../services/tradeService';
import { HttpResult, HttpResults, HttpValueResult } from '../models/httpResult';
import TYPES from '../constants/types';
import StatusCodes from 'http-status-codes';
import _ from 'lodash';
import { ERROR_CODES } from '../constants/const';

export interface ITradeController {
  add(trade: Trade): Promise<HttpResult>;
  eraseAll(): Promise<HttpResult>;
  getAll(trade: Trade): Promise<HttpValueResult<Trade[]>>;
  findByUserId(userId: number): Promise<HttpValueResult<Trade[]>>;
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

  private refineTimestamp = (data: { timestamp: Date }[] | null) => {
    if (data != null) {
      for (let i = 0; i < data.length; ++i) {
        if (data[i].timestamp) {
          var date = data[i].timestamp.toISOString().split(/[T.]/);
          Object.assign(data[i], { timestamp: date[0] + ' ' + date[1] });
        }
      }
    }
  };

  getAll = async (): Promise<HttpValueResult<Trade[]>> => {
    const result = await this.service.getAll();
    if (result.isSuccess) {
      this.refineTimestamp(result.value);
      return HttpResults.ok_value(result.value);
    } else return HttpResults.internal_server_error_value<Trade[]>([]);
  };

  findByUserId = async (userId: number): Promise<HttpValueResult<Trade[]>> => {
    const result = await this.service.findByUserId(userId);
    if (result.isSuccess) {
      this.refineTimestamp(result.value);
      return HttpResults.ok_value(result.value);
    } else if (result.errorCode == ERROR_CODES.USER_NOT_FOUND)
      return HttpResults.not_found_value<Trade[]>([]);
    return HttpResults.internal_server_error_value<Trade[]>([]);
  };

  getMinMaxPrice = async (
    symbol: string,
    start: Date,
    end: Date
  ): Promise<ValueResult<SymbolRange>> => {
    return Result.value(new SymbolRange());
  };
}
