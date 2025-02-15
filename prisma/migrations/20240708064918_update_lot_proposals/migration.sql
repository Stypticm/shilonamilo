/*
  Warnings:

  - You are about to drop the column `createdat` on the `Favorite` table. All the data in the column will be lost.
  - You are about to drop the column `thingid` on the `Favorite` table. All the data in the column will be lost.
  - You are about to drop the column `userid` on the `Favorite` table. All the data in the column will be lost.
  - You are about to drop the column `createdat` on the `User` table. All the data in the column will be lost.
  - You are about to drop the `Categories` table. If the table is not empty, all the data it contains will be lost.
  - You are about to drop the `Thing` table. If the table is not empty, all the data it contains will be lost.

*/
-- DropForeignKey
ALTER TABLE "Favorite" DROP CONSTRAINT "Favorite_thingid_fkey";

-- DropForeignKey
ALTER TABLE "Favorite" DROP CONSTRAINT "Favorite_userid_fkey";

-- DropForeignKey
ALTER TABLE "Thing" DROP CONSTRAINT "Thing_userid_fkey";

-- AlterTable
ALTER TABLE "Favorite" DROP COLUMN "createdat",
DROP COLUMN "thingid",
DROP COLUMN "userid",
ADD COLUMN     "LotId" VARCHAR(255),
ADD COLUMN     "createdAt" TIMESTAMP(6) DEFAULT CURRENT_TIMESTAMP,
ADD COLUMN     "userId" VARCHAR(255);

-- AlterTable
ALTER TABLE "User" DROP COLUMN "createdat",
ADD COLUMN     "createdAt" TIMESTAMP(6) DEFAULT CURRENT_TIMESTAMP;

-- DropTable
DROP TABLE "Categories";

-- DropTable
DROP TABLE "Thing";

-- CreateTable
CREATE TABLE "Category" (
    "id" TEXT NOT NULL,
    "name" VARCHAR(255) NOT NULL,

    CONSTRAINT "Category_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Lot" (
    "id" TEXT NOT NULL,
    "userId" VARCHAR(255),
    "name" VARCHAR(255),
    "category" VARCHAR(255),
    "description" TEXT,
    "country" VARCHAR(255),
    "city" VARCHAR(255),
    "createdAt" TIMESTAMP(6) DEFAULT CURRENT_TIMESTAMP,
    "photolot" VARCHAR(512),
    "addedcategory" BOOLEAN,
    "addeddescription" BOOLEAN,
    "addedlocation" BOOLEAN,

    CONSTRAINT "Lot_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Proposal" (
    "id" TEXT NOT NULL,
    "createdAt" TIMESTAMP(6) DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(6) DEFAULT CURRENT_TIMESTAMP,
    "lotId" VARCHAR(255),
    "offeredLotId" VARCHAR(255),

    CONSTRAINT "Proposal_pkey" PRIMARY KEY ("id")
);

-- AddForeignKey
ALTER TABLE "Favorite" ADD CONSTRAINT "Favorite_userId_fkey" FOREIGN KEY ("userId") REFERENCES "User"("id") ON DELETE NO ACTION ON UPDATE NO ACTION;

-- AddForeignKey
ALTER TABLE "Favorite" ADD CONSTRAINT "Favorite_LotId_fkey" FOREIGN KEY ("LotId") REFERENCES "Lot"("id") ON DELETE NO ACTION ON UPDATE NO ACTION;

-- AddForeignKey
ALTER TABLE "Lot" ADD CONSTRAINT "Lot_userId_fkey" FOREIGN KEY ("userId") REFERENCES "User"("id") ON DELETE NO ACTION ON UPDATE NO ACTION;

-- AddForeignKey
ALTER TABLE "Proposal" ADD CONSTRAINT "Proposal_lotId_fkey" FOREIGN KEY ("lotId") REFERENCES "Lot"("id") ON DELETE NO ACTION ON UPDATE NO ACTION;

-- AddForeignKey
ALTER TABLE "Proposal" ADD CONSTRAINT "Proposal_offeredLotId_fkey" FOREIGN KEY ("offeredLotId") REFERENCES "Lot"("id") ON DELETE NO ACTION ON UPDATE NO ACTION;
