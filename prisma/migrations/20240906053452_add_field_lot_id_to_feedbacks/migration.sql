-- AlterTable
ALTER TABLE "Feedback" ADD COLUMN     "lotId" VARCHAR(255);

-- AddForeignKey
ALTER TABLE "Feedback" ADD CONSTRAINT "Feedback_lotId_fkey" FOREIGN KEY ("lotId") REFERENCES "Lot"("id") ON DELETE NO ACTION ON UPDATE NO ACTION;
