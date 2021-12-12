import { injectable } from 'inversify';
import { connect } from 'mongoose';
import Result, { OperationResult } from '../../models/result';
import Trade from '../../models/trade';
import { TradeModel } from './schema/trade';

export interface ITradeRepository {
  insert(trade: Trade): Promise<OperationResult>;
}

@injectable()
export default class TradeRepository implements ITradeRepository {
  private _db_uri: string;
  private _db_opts: Object;
  constructor(db_uri: string, options: {}) {
    this._db_uri = db_uri;
    this._db_opts = options;
  }

  public insert = async (trade: Trade): Promise<OperationResult> => {
    await connect(this._db_uri, this._db_opts);

    var tradeDoc = new TradeModel(trade);
    tradeDoc.save();

    return Result.ok();
  };
}
