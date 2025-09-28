import Stake from "../Models/stake.model.js";
import Tournament from "../Models/tournament.model.js";

// @desc    Stake in a tournament
// @route   POST /api/stake/:tournamentId
// @access  Private
export const stakeInTournament = async (req, res) => {
  try {
    const { tournamentId } = req.params;
    const { walletAddress, stakeAmount } = req.body;

    if (!walletAddress || !stakeAmount) {
      return res
        .status(400)
        .json({ message: "Wallet address and stake amount are required" });
    }

    // Check if tournament exists
    const tournament = await Tournament.findById(tournamentId);
    if (!tournament) {
      return res.status(404).json({ message: "Tournament not found" });
    }

    // Save stake record
    const stake = await Stake.create({
      tournament: tournamentId,
      user: req.user.id,
      walletAddress,
      stakeAmount,
    });

    res.status(201).json({
      success: true,
      message: "Stake recorded. Awaiting blockchain confirmation.",
      stake,
    });
  } catch (error) {
    console.error("Error staking:", error.message);
    res.status(500).json({ message: "Server error" });
  }
};
