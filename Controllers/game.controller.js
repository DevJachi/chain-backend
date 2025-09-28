import Game from "../Models/game.model.js";
import { generateApiKey } from "../helpers/generateApiKey.js";

// @desc    Integrate a new game
// @route   POST /api/games
// @access  Private
export const integrateGame = async (req, res) => {
  try {
    const { name } = req.body;

    if (!name) {
      return res.status(400).json({ message: "Game name is required" });
    }

    // Check if game already exists
    const existing = await Game.findOne({ name });
    if (existing) {
      return res.status(400).json({ message: "Game already integrated" });
    }

    // Generate API Key
    const apiKey = generateApiKey();

    const game = await Game.create({
      name,
      apiKey,
      createdBy: req.user.id,
    });

    res.status(201).json({
      success: true,
      message: "Game integrated successfully",
      game,
    });
  } catch (error) {
    console.error("Error integrating game:", error.message);
    res.status(500).json({ message: "Server error" });
  }
};

// @desc    Get all integrated games
// @route   GET /api/games
// @access  Public
export const getGames = async (req, res) => {
  try {
    const games = await Game.find().select("name _id");
    res.status(200).json({ success: true, games });
  } catch (error) {
    console.error("Error fetching games:", error.message);
    res.status(500).json({ message: "Server error" });
  }
};
