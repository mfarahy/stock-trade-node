import Trade from 'src/models/trade';
import Result, { OperationResult } from 'src/models/result';
import { connect } from 'mongoose';
import { TradeModel } from './schema/trade';

export default class TradeRepository {
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

    return Result.OK();
  };
}
