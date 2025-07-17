/*
  Warnings:

  - You are about to drop the `AvaiableTriggers` table. If the table is not empty, all the data it contains will be lost.

*/
-- DropForeignKey
ALTER TABLE "Trigger" DROP CONSTRAINT "Trigger_triggerId_fkey";

-- DropTable
DROP TABLE "AvaiableTriggers";

-- CreateTable
CREATE TABLE "AvaiableTrigger" (
    "id" TEXT NOT NULL,
    "name" TEXT NOT NULL,

    CONSTRAINT "AvaiableTrigger_pkey" PRIMARY KEY ("id")
);

-- AddForeignKey
ALTER TABLE "Trigger" ADD CONSTRAINT "Trigger_triggerId_fkey" FOREIGN KEY ("triggerId") REFERENCES "AvaiableTrigger"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
