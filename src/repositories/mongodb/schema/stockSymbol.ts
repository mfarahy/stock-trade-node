import { model, Schema } from 'mongoose';
import StockSymbol from './../../../models/stockSymbol';

export const StockSymbolSchema = new Schema<StockSymbol>({
  id: {
    type: String,
    unique: true,
    index: true,
    maxlength: 10,
    minlength: 1,
    uppercase: true,
    required: true,
  },
  name: { type: String, minlength: 1, maxlength: 100 },
  lastPrice: { type: Number },
  lastTrade: { type: Date },
});

export const StockSymbolModel = model<StockSymbol>('Symbol', StockSymbolSchema);
