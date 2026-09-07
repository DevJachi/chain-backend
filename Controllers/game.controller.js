import Game from "../Models/game.model.js";
import { generateApiKey } from "../helpers/generateApiKey.js";

export const integrateGame = async (req, res) => {
  try {
    const { name } = req.body;

    if (!name) {
      return res.status(400).json({ message: "Game name is required" });
    }

    const existing = await Game.findOne({ name });
    if (existing) {
      return res.status(400).json({ message: "Game already integrated" });
    }

    const apiKey = generateApiKey();

    const game = await Game.create({ name, apiKey });

    res.status(201).json({ success: true, message: "Game integrated successfully", game, apiKey });
  } catch (error) {
    res.status(500).json({ message: "Server error" });
  }
};

export const getGames = async (req, res) => {
  try {
    const games = await Game.find().select("name _id");
    res.status(200).json({ success: true, games });
  } catch (error) {
    res.status(500).json({ message: "Server error" });
  }
};
