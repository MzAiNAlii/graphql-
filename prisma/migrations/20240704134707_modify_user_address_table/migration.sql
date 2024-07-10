/*
  Warnings:

  - You are about to drop the column `zipCode` on the `user_address` table. All the data in the column will be lost.
  - You are about to alter the column `latitude` on the `user_address` table. The data in that column could be lost. The data in that column will be cast from `DoublePrecision` to `Decimal(65,30)`.
  - You are about to alter the column `longitude` on the `user_address` table. The data in that column could be lost. The data in that column will be cast from `DoublePrecision` to `Decimal(65,30)`.

*/
-- DropForeignKey
ALTER TABLE "user_address" DROP CONSTRAINT "user_address_userId_fkey";

-- AlterTable
ALTER TABLE "user_address" DROP COLUMN "zipCode",
ALTER COLUMN "latitude" SET DATA TYPE DECIMAL(65,30),
ALTER COLUMN "longitude" SET DATA TYPE DECIMAL(65,30),
ALTER COLUMN "userId" DROP NOT NULL;

-- AddForeignKey
ALTER TABLE "user_address" ADD CONSTRAINT "user_address_userId_fkey" FOREIGN KEY ("userId") REFERENCES "user"("id") ON DELETE SET NULL ON UPDATE CASCADE;
