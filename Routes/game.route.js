import express from "express";
import { integrateGame, getGames } from "../Controllers/game.controller.js";
import { protect } from "../Middleware/auth.middleware.js";

const router = express.Router();

router.post("/putGames", protect, integrateGame);
router.get("/getGames", getGames);

export default router;
