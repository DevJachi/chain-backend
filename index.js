import cors from "cors";
import express from "express";
import { connectDB } from "./db/connectDB.js";
import tournamentRoute from "./Routes/tournament.route.js";
import authRoute from "./Routes/auth.route.js";
import GameRoute from "./Routes/game.route.js";
import StakeRoute from "./Routes/stake.route.js";
import "dotenv/config";

const app = express();
const PORT = process.env.PORT || 3001;

app.use(
  cors({
    origin: [
      "http://localhost:5173",
      "https://chainarena-ten.vercel.app",
    ],
    methods: ["GET", "POST", "PUT", "DELETE"],
    credentials: true,
  })
);

app.use(express.json());

app.use("/api", tournamentRoute);
app.use("/api", authRoute);
app.use("/api", GameRoute);
app.use("/api", StakeRoute);

app.listen(PORT, () => {
  connectDB();
  console.log(`Listening on ${PORT}`);
});
