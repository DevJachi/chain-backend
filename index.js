import { ethers } from "ethers";
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
    origin: "https://chainarena-ten.vercel.app/",
    methods: ["GET", "POST", "PUT", "DELETE"],
    credentials: true,
  })
);

app.use(express.json());

app.use("/api", tournamentRoute);
app.use("/api", authRoute);
app.use("/api", GameRoute);
app.use("/api", StakeRoute);

// Setup Connections
const URL = `https://eth-mainnet.g.alchemy.com/v2/${process.env.ALCHEMY_API_KEY}`;
const provider = new ethers.JsonRpcProvider(URL);
const ADDRESS = "0x1C727a55eA3c11B0ab7D3a361Fe0F3C47cE6de5d";

app.listen(PORT, () => {
  connectDB();
  console.log(`Listening on ${PORT}`);
});

console.log("Server Running...");
