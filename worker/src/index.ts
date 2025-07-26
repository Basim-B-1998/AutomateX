require('dotenv').config();

import { PrismaClient } from "@prisma/client";
import { JsonObject } from "@prisma/client/runtime/library";
import { Kafka } from "kafkajs";
import { parse } from "./parser";
import { sendEmail } from "./email";
import { sendSol } from "./solana";

const prismaClient = new PrismaClient();
const TOPIC_NAME = "zap-events";

const kafka = new Kafka({
  clientId: 'outbox-processor-2',
  brokers: ['localhost:9092'],
});

async function main() {
  const consumer = kafka.consumer({ groupId: 'main-worker-2' });
  await consumer.connect();

  const producer = kafka.producer();
  await producer.connect();

  await consumer.subscribe({ topic: TOPIC_NAME, fromBeginning: true });

  await consumer.run({
    autoCommit: false,
    eachMessage: async ({ topic, partition, message }) => {
      const valueStr = message.value?.toString();
      console.log({
        partition,
        offset: message.offset,
        value: valueStr,
      });

      if (!valueStr) {
        console.warn("⚠️ No message value found, skipping.");
        return;
      }

      let parsedValue: any;
      try {
        parsedValue = JSON.parse(valueStr);
      } catch (e) {
        console.error("❌ Invalid JSON received, skipping message:", valueStr);
        return;
      }

      const zapRunId = parsedValue.zapRunId;
      const stage = parsedValue.stage;

      if (!zapRunId || stage === undefined) {
        console.warn("⚠️ Invalid structure: missing zapRunId or stage. Skipping.");
        return;
      }

      const zapRunDetails = await prismaClient.zapRun.findFirst({
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


      console.log("All actions in zap:", JSON.stringify(zapRunDetails?.zap.action, null, 2));
console.log("Looking for stage:", stage);

      const currentAction = zapRunDetails?.zap.action.find(
        (x) => x.sortingOrder === stage
      );

      if (!currentAction) {
        console.log("⚠️ Current action not found for stage:", stage);
        return;
      }

      const zapRunMetadata = zapRunDetails?.metadata;

      if (currentAction.type.id === "email") {
        const body = parse((currentAction.metadata as JsonObject)?.body as string, zapRunMetadata);
        const to = parse((currentAction.metadata as JsonObject)?.email as string, zapRunMetadata);
        console.log(`Sending out email to ${to}, body is: ${body}`);
        await sendEmail(to, body);
        console.log("📧 send email");
      }

      if (currentAction.type.id === "send_sol") {
        const amount = parse((currentAction.metadata as JsonObject)?.amount as string, zapRunMetadata);
        const address = parse((currentAction.metadata as JsonObject)?.address as string, zapRunMetadata);
        console.log(`🔁 Sending SOL of ${amount} to ${address}`);
        await sendSol(address, amount);
        console.log("💸 send solana");
      }

      await new Promise((r) => setTimeout(r, 500));

      const lastStage = (zapRunDetails?.zap.action?.length || 1) - 1;

      if (lastStage !== stage) {
        console.log("⏩ pushing next stage to queue");
        await producer.send({
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

      await consumer.commitOffsets([
        {
          topic: TOPIC_NAME,
          partition,
          offset: (parseInt(message.offset) + 1).toString(),
        },
      ]);
    },
  });
}

main();
