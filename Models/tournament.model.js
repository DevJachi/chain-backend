import mongoose from "mongoose";

const tournamentSchema = new mongoose.Schema({
  name: { type: String, required: true, trim: true },
  gameId: { type: mongoose.Schema.Types.ObjectId, ref: "Game", required: true },
  tournamentCode: { type: String, unique: true, required: true },
  stakeAmount: { type: Number, required: true, min: 0 },
  minPlayers: { type: Number, required: true, min: 2 },
  maxPlayers: { type: Number, required: true },
  participants: [
    {
      userId: { type: mongoose.Schema.Types.ObjectId, ref: "User" },
      joinedAt: { type: Date, default: Date.now },
      walletAddress: { type: String },
      hasStaked: { type: Boolean, default: false },
    },
  ],
  status: {
    type: String,
    enum: ["pending", "ongoing", "completed"],
    default: "pending",
  },
  createdAt: { type: Date, default: Date.now },
});

export default mongoose.model("Tournament", tournamentSchema);
