/*
  Warnings:

  - You are about to drop the column `myLotId` on the `Chat` table. All the data in the column will be lost.
  - You are about to drop the column `partnerLotId` on the `Chat` table. All the data in the column will be lost.

*/
-- DropForeignKey
ALTER TABLE "Chat" DROP CONSTRAINT "Chat_myLotId_fkey";

-- DropForeignKey
ALTER TABLE "Chat" DROP CONSTRAINT "Chat_partnerLotId_fkey";

-- AlterTable
ALTER TABLE "Chat" DROP COLUMN "myLotId",
DROP COLUMN "partnerLotId",
ADD COLUMN     "lot1Id" VARCHAR(255),
ADD COLUMN     "lot2Id" VARCHAR(255);

-- AddForeignKey
ALTER TABLE "Chat" ADD CONSTRAINT "Chat_lot1Id_fkey" FOREIGN KEY ("lot1Id") REFERENCES "Lot"("id") ON DELETE NO ACTION ON UPDATE NO ACTION;

-- AddForeignKey
ALTER TABLE "Chat" ADD CONSTRAINT "Chat_lot2Id_fkey" FOREIGN KEY ("lot2Id") REFERENCES "Lot"("id") ON DELETE NO ACTION ON UPDATE NO ACTION;
