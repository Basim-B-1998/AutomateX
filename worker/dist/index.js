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
require('dotenv').config();
const client_1 = require("@prisma/client");
const kafkajs_1 = require("kafkajs");
const parser_1 = require("./parser");
const email_1 = require("./email");
const solana_1 = require("./solana");
const prismaClient = new client_1.PrismaClient();
const TOPIC_NAME = "zap-events";
const kafka = new kafkajs_1.Kafka({
    clientId: 'outbox-processor-2',
    brokers: ['localhost:9092'],
});
function main() {
    return __awaiter(this, void 0, void 0, function* () {
        const consumer = kafka.consumer({ groupId: 'main-worker-2' });
        yield consumer.connect();
        const producer = kafka.producer();
        yield producer.connect();
        yield consumer.subscribe({ topic: TOPIC_NAME, fromBeginning: true });
        yield consumer.run({
            autoCommit: false,
            eachMessage: (_a) => __awaiter(this, [_a], void 0, function* ({ topic, partition, message }) {
                var _b, _c, _d, _e, _f, _g;
                const valueStr = (_b = message.value) === null || _b === void 0 ? void 0 : _b.toString();
                console.log({
                    partition,
                    offset: message.offset,
                    value: valueStr,
                });
                if (!valueStr) {
                    console.warn("⚠️ No message value found, skipping.");
                    return;
                }
                let parsedValue;
                try {
                    parsedValue = JSON.parse(valueStr);
                }
                catch (e) {
                    console.error("❌ Invalid JSON received, skipping message:", valueStr);
                    return;
                }
                const zapRunId = parsedValue.zapRunId;
                const stage = parsedValue.stage;
                if (!zapRunId || stage === undefined) {
                    console.warn("⚠️ Invalid structure: missing zapRunId or stage. Skipping.");
                    return;
                }
                const zapRunDetails = yield prismaClient.zapRun.findFirst({
                    where: { id: zapRunId },
                    include: {
                        zap: {
                            include: {
                                action: {
                                    include: {
                                        type: true,
                                    },
                                },
                            },
                        },
                    },
                });
                console.log("zapRunDetails:", JSON.stringify(zapRunDetails, null, 2));
                console.log("All actions in zap:", JSON.stringify(zapRunDetails === null || zapRunDetails === void 0 ? void 0 : zapRunDetails.zap.action, null, 2));
                console.log("Looking for stage:", stage);
                const currentAction = zapRunDetails === null || zapRunDetails === void 0 ? void 0 : zapRunDetails.zap.action.find((x) => x.sortingOrder === stage);
                if (!currentAction) {
                    console.log("⚠️ Current action not found for stage:", stage);
                    return;
                }
                const zapRunMetadata = zapRunDetails === null || zapRunDetails === void 0 ? void 0 : zapRunDetails.metadata;
                if (currentAction.type.id === "email") {
                    const body = (0, parser_1.parse)((_c = currentAction.metadata) === null || _c === void 0 ? void 0 : _c.body, zapRunMetadata);
                    const to = (0, parser_1.parse)((_d = currentAction.metadata) === null || _d === void 0 ? void 0 : _d.email, zapRunMetadata);
                    console.log(`Sending out email to ${to}, body is: ${body}`);
                    yield (0, email_1.sendEmail)(to, body);
                    console.log("📧 send email");
                }
                if (currentAction.type.id === "send_sol") {
                    const amount = (0, parser_1.parse)((_e = currentAction.metadata) === null || _e === void 0 ? void 0 : _e.amount, zapRunMetadata);
                    const address = (0, parser_1.parse)((_f = currentAction.metadata) === null || _f === void 0 ? void 0 : _f.address, zapRunMetadata);
                    console.log(`🔁 Sending SOL of ${amount} to ${address}`);
                    yield (0, solana_1.sendSol)(address, amount);
                    console.log("💸 send solana");
                }
                yield new Promise((r) => setTimeout(r, 500));
                const lastStage = (((_g = zapRunDetails === null || zapRunDetails === void 0 ? void 0 : zapRunDetails.zap.action) === null || _g === void 0 ? void 0 : _g.length) || 1) - 1;
                if (lastStage !== stage) {
                    console.log("⏩ pushing next stage to queue");
                    yield producer.send({
                        topic: TOPIC_NAME,
                        messages: [
                            {
                                value: JSON.stringify({
                                    stage: stage + 1,
                                    zapRunId,
                                }),
                            },
                        ],
                    });
                }
                console.log("✅ processing done");
                yield consumer.commitOffsets([
                    {
                        topic: TOPIC_NAME,
                        partition,
                        offset: (parseInt(message.offset) + 1).toString(),
                    },
                ]);
            }),
        });
    });
}
main();
