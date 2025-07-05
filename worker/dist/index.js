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
const kafkajs_1 = require("kafkajs");
const TOPIC_NAME = "zap-events";
const kafka = new kafkajs_1.Kafka({
    clientId: 'outbox-processor',
    brokers: ['localhost:9092']
});
function main() {
    return __awaiter(this, void 0, void 0, function* () {
        //initialise kafka consumer
        const consumer = kafka.consumer({ groupId: 'main-worker' });
        //connects to it
        yield consumer.connect();
        //subscribe on specfic topic
        yield consumer.subscribe({ topic: TOPIC_NAME, fromBeginning: true });
        //calls consumer.run every time msg come kog occurs
        yield consumer.run({
            autoCommit: false,
            eachMessage: (_a) => __awaiter(this, [_a], void 0, function* ({ topic, partition, message }) {
                var _b;
                console.log({
                    partition,
                    offset: message.offset,
                    value: (_b = message.value) === null || _b === void 0 ? void 0 : _b.toString(),
                });
                //stops execution for 1 sec,bcz gor example sending email may take 1 sec
                yield new Promise(r => setTimeout(r, 5000));
                console.log("processing done");
                //acknowledges worker had done the job
                yield consumer.commitOffsets([{
                        topic: TOPIC_NAME,
                        partition: partition,
                        offset: message.offset + 1
                    }]);
            })
        });
    });
}
main();
