import { ethers } from "ethers";
import "dotenv/config";
import { promptForKey } from "./helpers/prompt.js";

//Import private key helper

//Setup Connection
const URL = `https://virtual.mainnet.eu.rpc.tenderly.co/${process.env.TENDERLY_RPC_URL}`;
const provider = new ethers.JsonRpcProvider(URL);

const main = async () => {
  // const privateKey = await promptForKey();
  // Setup Wallet
  const wallet = ethers.Wallet.createRandom();
  const walletAddress = wallet.address;

  console.log(walletAddress);

  const senderBalanceBefore = await provider.getBalance(walletAddress);

  // Log Balances
  console.log(
    `\nEth Account Of ${walletAddress} --> ${ethers.formatEther(
      senderBalanceBefore,
      18
    )} ETH\n`
  );

  // Create Transactions

  // Unit Transactions

  // Get Balances

  // Log Balances
};
main();
