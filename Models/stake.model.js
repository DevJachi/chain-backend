import mongoose from "mongoose";

const stakeSchema = new mongoose.Schema(
  {
    tournament: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Tournament",
      required: true,
    },
    // user: {
    //  type: mongoose.Schema.Types.ObjectId,
    // ref: "User",
    //  required: true,
    //},
    walletAddress: {
      type: String,
      required: true,
    },
    stakeAmount: {
      type: Number,
      required: true,
    },
    status: {
      type: String,
      enum: ["pending", "confirmed"],
      default: "pending",
    },
  },
  { timestamps: true }
);

export default mongoose.model("Stake", stakeSchema);
