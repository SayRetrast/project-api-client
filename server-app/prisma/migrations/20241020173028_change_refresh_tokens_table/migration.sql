/*
  Warnings:

  - The primary key for the `refresh_tokens` table will be changed. If it partially fails, the table could be left without primary key constraint.
  - You are about to drop the column `browser` on the `refresh_tokens` table. All the data in the column will be lost.
  - You are about to drop the column `device` on the `refresh_tokens` table. All the data in the column will be lost.
  - Added the required column `user_agent` to the `refresh_tokens` table without a default value. This is not possible if the table is not empty.

*/
-- AlterTable
ALTER TABLE "refresh_tokens" DROP CONSTRAINT "refresh_tokens_pkey",
DROP COLUMN "browser",
DROP COLUMN "device",
ADD COLUMN     "user_agent" TEXT NOT NULL,
ADD CONSTRAINT "refresh_tokens_pkey" PRIMARY KEY ("user_id", "user_agent");
