import { model, Schema } from 'mongoose';
import Trade from 'src/models/trade';
import { TradeJsonSchema } from 'src/validations/trade';

const tradeSchema = new Schema<Trade>(TradeJsonSchema);
export const TradeModel = model<Trade>('Trade', tradeSchema);
