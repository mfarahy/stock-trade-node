import { model, Schema } from 'mongoose';
import User from '../../../models/user';

export const UserSchema = new Schema<User>({
  id: { type: Number, unique: true, index: true },
  name: { type: String, minlength: 1, maxlength: 100 },
});

export const UserModel = model<User>('User', UserSchema);
