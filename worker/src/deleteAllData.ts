import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

async function main() {
  console.log('🧹 Deleting all data...');

  // await prisma.zapRunOutbox.deleteMany();
  // await prisma.zapRun.deleteMany();
  // await prisma.action.deleteMany();
  await prisma.trigger.deleteMany();
  await prisma.zap.deleteMany();

  // console.log('✅ All data deleted from Zap, Trigger, Action, ZapRun, ZapRunOutbox');
  console.log("data deleted from Zap, Trigger");
  
}



main()
  .catch((e) => console.error(e))
  .finally(() => prisma.$disconnect());
