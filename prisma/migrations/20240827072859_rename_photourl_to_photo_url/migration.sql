/*
  Warnings:

  - You are about to drop the column `photourl` on the `User` table. All the data in the column will be lost.

*/
ALTER TABLE "User" RENAME COLUMN "photourl" TO "photoURL";
