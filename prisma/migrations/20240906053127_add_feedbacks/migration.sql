-- CreateTable
CREATE TABLE "Feedback" (
    "id" TEXT NOT NULL,
    "rating" INTEGER DEFAULT 0,
    "comment" VARCHAR(255),
    "ownerId" VARCHAR(255),
    "createdAt" TIMESTAMP(6) DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(6) DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "Feedback_pkey" PRIMARY KEY ("id")
);

-- AddForeignKey
ALTER TABLE "Feedback" ADD CONSTRAINT "Feedback_ownerId_fkey" FOREIGN KEY ("ownerId") REFERENCES "User"("id") ON DELETE NO ACTION ON UPDATE NO ACTION;
