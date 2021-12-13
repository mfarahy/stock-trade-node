import { Schema } from 'mongoose';
import User from '../../../models/user';

const UserSchema = new Schema<User>({
  id: Number,
  name: String,
});
