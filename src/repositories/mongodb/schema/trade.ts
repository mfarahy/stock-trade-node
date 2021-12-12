import { model, Schema } from 'mongoose';
import Trade from '../../../models/trade';
import { TradeJsonSchema } from '../../../validations/trade';

const tradeSchema = new Schema<Trade>(TradeJsonSchema);
export const TradeModel = model<Trade>('Trade', tradeSchema);
