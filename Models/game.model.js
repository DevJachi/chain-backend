import mongoose from "mongoose";

const gameSchema = new mongoose.Schema(
  {
    name: { type: String, required: true, unique: true },
    apiKey: { type: String, required: true, unique: true },
  },
  { timestamps: true }
);

export default mongoose.model("Game", gameSchema);
