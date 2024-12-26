/*
  Warnings:

  - You are about to drop the column `LotId` on the `Favorite` table. All the data in the column will be lost.

*/
-- DropForeignKey
ALTER TABLE "Favorite" DROP CONSTRAINT "Favorite_LotId_fkey";

-- AlterTable
ALTER TABLE "Favorite" DROP COLUMN "LotId",
ADD COLUMN     "lotId" VARCHAR(255);

-- AddForeignKey
ALTER TABLE "Favorite" ADD CONSTRAINT "Favorite_lotId_fkey" FOREIGN KEY ("lotId") REFERENCES "Lot"("id") ON DELETE NO ACTION ON UPDATE NO ACTION;
