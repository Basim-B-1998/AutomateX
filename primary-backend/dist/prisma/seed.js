"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
Object.defineProperty(exports, "__esModule", { value: true });
const client_1 = require("@prisma/client");
const prismaClient = new client_1.PrismaClient();
function main() {
    return __awaiter(this, void 0, void 0, function* () {
        yield prismaClient.avaiableTrigger.create({
            data: {
                id: "webhook",
                name: "Webhook",
                image: "https://flespi.com/storage/news/643e695e865f7/643e7305a97f0.png"
            }
        });
        yield prismaClient.avaiableAction.create({
            data: {
                id: "send_sol",
                name: "send Solana",
                image: "https://upload.wikimedia.org/wikipedia/en/b/b9/Solana_logo.png"
            }
        });
        yield prismaClient.avaiableAction.create({
            data: {
                id: "email",
                name: "send Email",
                image: "https://cdn4.iconfinder.com/data/icons/social-media-logos-6/512/112-gmail_email_mail-512.png"
            }
        });
    });
}
main();
