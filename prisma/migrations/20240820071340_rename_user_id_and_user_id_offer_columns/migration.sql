/*
  Warnings:

  - You are about to drop the column `userId` on the `Proposal` table. All the data in the column will be lost.
  - You are about to drop the column `userIdOffered` on the `Proposal` table. All the data in the column will be lost.

*/
-- AlterTable
ALTER TABLE "Proposal" DROP COLUMN "userId",
DROP COLUMN "userIdOffered",
ADD COLUMN     "ownerIdOfTheLot" VARCHAR(255),
ADD COLUMN     "userIdOfferedLot" VARCHAR(255);
