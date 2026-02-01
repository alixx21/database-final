import mongoose from "mongoose";

const hotelSchema = new mongoose.Schema(
  {
    name: { type: String, required: true },
    city: { type: String, required: true, index: true },
    address: { type: String, required: true },
    description: { type: String, default: "" },
    rating: { type: Number, default: 0 },
    createdAt: { type: Date, default: Date.now }
  },
  { versionKey: false }
);

export default mongoose.model("Hotel", hotelSchema);
