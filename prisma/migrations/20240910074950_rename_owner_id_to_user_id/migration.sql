/*
  Warnings:

  - You are about to drop the column `ownerId` on the `Feedback` table. All the data in the column will be lost.

*/
-- DropForeignKey
ALTER TABLE "Feedback" DROP CONSTRAINT "Feedback_ownerId_fkey";

-- AlterTable
ALTER TABLE "Feedback" DROP COLUMN "ownerId",
ADD COLUMN     "userId" VARCHAR(255);

-- AddForeignKey
ALTER TABLE "Feedback" ADD CONSTRAINT "Feedback_userId_fkey" FOREIGN KEY ("userId") REFERENCES "User"("id") ON DELETE NO ACTION ON UPDATE NO ACTION;
