import { model, Schema } from 'mongoose';
import Trade from '../../../models/trade';

const tradeSchema = new Schema({
  id: { type: Number, unique: true, required: true },
  type: { type: String, required: true, maxlength: 3, minlength: 3 },
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
  timestamp: { type: Date, default: Date.now, required: true },
});
export const TradeModel = model<Trade>('Trade', tradeSchema);
