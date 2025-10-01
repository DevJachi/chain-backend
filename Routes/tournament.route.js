import express from "express";
import { createTournament } from "../Controllers/tournament.controller.js";
import { joinTournament } from "../Controllers/tournament.controller.js";
import { getTournaments } from "../Controllers/tournament.controller.js";
import { protect } from "../Middleware/auth.middleware.js";
import { getTournamentById } from "../Controllers/tournament.controller.js";
const router = express.Router();

router.post("/createTournament", createTournament);
router.post("/tournaments/:id/join", joinTournament);
router.get("/getTournament", getTournaments);
router.get("/tournaments/:id", getTournamentById);

export default router;
