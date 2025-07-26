import "dotenv/config";

import {
  Keypair,
  LAMPORTS_PER_SOL,
  SystemProgram,
  Transaction,
  PublicKey,
  sendAndConfirmTransaction,
  Connection
} from "@solana/web3.js";
import base58 from "bs58";

const connection = new Connection("https://api.devnet.solana.com", "confirmed");

export async function sendSol(to: string, amount: string) {
  const keypair = Keypair.fromSecretKey(
    base58.decode(process.env.SOL_PRIVATE_KEY ?? "")
  );
  console.log("Sender:", keypair.publicKey.toBase58());

  const tx = new Transaction().add(
    SystemProgram.transfer({
      fromPubkey: keypair.publicKey,
      toPubkey: new PublicKey(to),
      lamports: parseFloat(amount) * LAMPORTS_PER_SOL,
    })
  );

  const signature = await sendAndConfirmTransaction(connection, tx, [keypair]);
  console.log("✅ SOL sent in devnet! Signature:", signature);
}

