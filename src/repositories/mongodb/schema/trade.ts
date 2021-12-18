import { model, Schema } from 'mongoose';
import Trade from '../../../models/trade';

const tradeSchema = new Schema({
  id: { type: Number, unique: true, required: true },
  type: { type: String, required: true, maxlength: 4, minlength: 3, lowercase: true },
  user: {
    id: {
      type: Number,
      required: true,
    },
    name: {
      type: String,
      required: true,
    },
  },
  symbol: { type: String, maxlength: 5, required: true },
  shares: { type: Number, required: true },
  price: { type: Number, required: true },
  price_difference: { type: Number, default: 0 },
  price_direction: { type: String, length:1,default:'N' },//'N'|'U'|'D'
  timestamp: { type: Date, default: Date.now, required: true },
});
export const TradeModel = model<Trade>('Trade', tradeSchema);
