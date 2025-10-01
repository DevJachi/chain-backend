import express from "express";
import { stakeInTournament } from "../Controllers/stake.controller.js";
import { protect } from "../Middleware/auth.middleware.js";

const router = express.Router();

router.post("/:tournamentId", stakeInTournament);

export default router;
