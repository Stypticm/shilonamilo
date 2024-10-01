-- AlterTable
ALTER TABLE "Proposal" ADD COLUMN     "isOwnerConfirmedExchange" BOOLEAN NOT NULL DEFAULT false,
ADD COLUMN     "isUserConfirmedExchange" BOOLEAN NOT NULL DEFAULT false;
