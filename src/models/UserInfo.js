import { model, models, Schema } from "mongoose";

const UserInfoSchema = new Schema({
  email: { type: String, required: true },
  streetAddress: { type: String },
  postalCode: { type: String },
  city: { type: String },
  country: { type: String },
  phone: { type: String },
  admin: { type: Boolean, default: false },
});

export const UserInfo = models?.UserInfo || model('UserInfo', UserInfoSchema);