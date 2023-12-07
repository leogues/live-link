/*
  Warnings:

  - Added the required column `provider` to the `User` table without a default value. This is not possible if the table is not empty.

*/
-- AlterTable
ALTER TABLE "User" ADD COLUMN     "provider" TEXT NOT NULL,
ALTER COLUMN "lastName" DROP NOT NULL,
ALTER COLUMN "pickture" DROP NOT NULL;
