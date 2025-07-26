"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const web3_js_1 = require("@solana/web3.js");
const bs58_1 = __importDefault(require("bs58"));
const keypair = web3_js_1.Keypair.generate();
console.log("✅ Save this in your .env file:");
console.log('SOL_PRIVATE_KEY="' + bs58_1.default.encode(keypair.secretKey) + '"');
console.log("Public Key (wallet address):", keypair.publicKey.toBase58());
