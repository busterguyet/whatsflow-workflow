import mongoose from "mongoose";

const Schema = mongoose.Schema;

const UserSchema = new Schema({
  phone: { type: String, required: true, index: true },
  name: String,
  arrivalCity: String,
  arrivalDateTime: String,
  departureDateTime: String,
  departureMethod: String,
  step: { type: Number, default: 0 },
  createdAt: { type: Date, default: Date.now }
});

export default mongoose.model("User", UserSchema);
