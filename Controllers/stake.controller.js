import Stake from "../Models/stake.model.js";
import Tournament from "../Models/tournament.model.js";

export const stakeInTournament = async (req, res) => {
  try {
    const { tournamentId } = req.params;
    const { walletAddress, stakeAmount } = req.body;

    if (!walletAddress || !stakeAmount) {
      return res.status(400).json({ message: "Wallet address and stake amount are required" });
    }

    const tournament = await Tournament.findById(tournamentId);
    if (!tournament) {
      return res.status(404).json({ message: "Tournament not found" });
    }

    const stake = await Stake.create({ tournament: tournamentId, walletAddress, stakeAmount });

    res.status(201).json({
      success: true,
      message: "Stake recorded. Awaiting blockchain confirmation.",
      stake,
    });
  } catch (error) {
    res.status(500).json({ message: "Server error" });
  }
};
