-- AlterTable
ALTER TABLE "user" ADD COLUMN     "imageUrl" TEXT,
ADD COLUMN     "isBlocked" BOOLEAN NOT NULL DEFAULT false,
ADD COLUMN     "isDelete" BOOLEAN DEFAULT false,
ADD COLUMN     "isVerify" BOOLEAN DEFAULT false;
