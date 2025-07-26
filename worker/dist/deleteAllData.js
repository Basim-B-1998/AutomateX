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
const prisma = new client_1.PrismaClient();
function main() {
    return __awaiter(this, void 0, void 0, function* () {
        console.log('🧹 Deleting all data...');
        // await prisma.zapRunOutbox.deleteMany();
        // await prisma.zapRun.deleteMany();
        // await prisma.action.deleteMany();
        yield prisma.trigger.deleteMany();
        yield prisma.zap.deleteMany();
        // console.log('✅ All data deleted from Zap, Trigger, Action, ZapRun, ZapRunOutbox');
        console.log("data deleted from Zap, Trigger");
    });
}
main()
    .catch((e) => console.error(e))
    .finally(() => prisma.$disconnect());
