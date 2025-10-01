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
      //creatorId: req.user._id, // always the Mongo ObjectId
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
    const apiKey = req.headers["authorization"];
    const { code } = req.body;
    const { id } = req.params;

    console.log("Join tournament:", { id, code, apiKey });

    // Validate API key
    if (!apiKey) {
      return res.status(401).json({ error: "Authorization header required" });
    }
    const game = await Game.findOne({ apiKey });
    if (!game) {
      return res.status(401).json({ error: "Invalid API key" });
    }

    // Find tournament
    const tournament = await Tournament.findById(id);
    if (!tournament || tournament.code !== code) {
      return res.status(400).json({ error: "Invalid tournament ID or code" });
    }

    // Check if already joined
    const alreadyJoined = tournament.participants.some(
      (p) => p.apiKey === apiKey
    );
    if (alreadyJoined) {
      return res
        .status(400)
        .json({ error: "Game already joined this tournament" });
    }

    // Add participant
    tournament.participants.push({
      apiKey,
      joinedAt: new Date(),
    });

    await tournament.save();

    res.status(200).json({ success: true });
  } catch (error) {
    console.error("Error joining tournament:", error.message);
    res.status(500).json({ error: "Server error joining tournament" });
  }
};

export const getTournaments = async (req, res) => {
  try {
    const tournaments = await Tournament.find();
    res.json(tournaments);
  } catch (error) {
    res.status(500).json({ error: "Server error fetching tournaments" });
  }
};

export const getTournamentById = async (req, res) => {
  try {
    const tournament = await Tournament.findById(req.params.id).populate(
      "gameId",
      "name"
    );
    if (!tournament) {
      return res.status(404).json({ error: "Tournament not found" });
    }
    res.json(tournament);
  } catch (error) {
    res.status(500).json({ error: "Server error fetching tournament" });
  }
};
