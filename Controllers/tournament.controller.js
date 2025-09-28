import Tournament from "../Models/tournament.model.js";
import Game from "../Models/game.model.js";
import crypto from "crypto";

export const createTournament = async (req, res) => {
  try {
    const { name, gameId, stakeAmount, minPlayers, maxPlayers } = req.body;

    if (!minPlayers || !maxPlayers) {
      return res
        .status(400)
        .json({ error: "minPlayers and maxPlayers are required" });
    }

    if (minPlayers > 2) {
      return res.status(400).json({ error: "minPlayers must be at least 2" });
    }

    if (minPlayers >= maxPlayers) {
      return res
        .status(400)
        .json({ error: "minPlayers must be less than maxPlayers" });
    }

    const game = await Game.findById(gameId);
    if (!game) return res.status(404).json({ error: "Game not found" });

    const tournamentCode = crypto.randomBytes(4).toString("hex");

    const tournament = new Tournament({
      name,
      gameId,
      creatorId: req.user._id, // always the Mongo ObjectId
      tournamentCode,
      stakeAmount,
      minPlayers,
      maxPlayers,
    });

    await tournament.save();

    res.status(201).json({
      message: "Tournament created",
      tournament: {
        id: tournament._id,
        name: tournament.name,
        code: tournament.tournamentCode,
        stakeAmount: tournament.stakeAmount,
        minPlayers: tournament.minPlayers,
        maxPlayers: tournament.maxPlayers,
        status: tournament.status,
      },
    });
  } catch (error) {
    console.error(error);
    res
      .status(500)
      .json({ msg: error.message, error: "Server error creating tournament" });
  }
};

export const joinTournament = async (req, res) => {
  try {
    const { tournamentCode, walletAddress } = req.body;

    const tournament = await Tournament.findOne({ tournamentCode });
    if (!tournament)
      return res.status(404).json({ error: "Tournament not found" });

    // check if already joined
    const alreadyJoined = tournament.participants.some(
      (p) => p.userId.toString() === req.user._id.toString()
    );
    if (alreadyJoined) {
      return res
        .status(400)
        .json({ error: "You already joined this tournament" });
    }

    // add participant
    tournament.participants.push({
      userId: req.user._id,
      walletAddress,
      hasStaked: false, // will flip true after staking
    });

    await tournament.save();

    res.json({
      message: "Joined tournament successfully",
      tournamentId: tournament._id,
      participants: tournament.participants.length,
    });
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: "Server error joining tournament" });
  }
};

export const getTournaments = async (req, res) => {
  const tournaments = await Tournament.find().populate(
    "creatorId",
    "name email"
  );
  res.json(tournaments);
};
export const getTournamentById = async (req, res) => {
  try {
    const tournament = await Tournament.findById(req.params.id)
      .populate("gameId", "name")
      .populate("creatorId", "name email");
    if (!tournament) {
      return res.status(404).json({ error: "Tournament not found" });
    }
    res.json(tournament);
  } catch (error) {
    res.status(500).json({ error: "Server error fetching tournament" });
  }
};
