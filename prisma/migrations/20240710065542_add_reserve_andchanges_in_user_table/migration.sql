-- CreateEnum
CREATE TYPE "ReserveStatus" AS ENUM ('RESERVED', 'UNRESERVED');

-- CreateTable
CREATE TABLE "Reserve" (
    "id" TEXT NOT NULL,
    "userId" TEXT,
    "eventId" TEXT,
    "status" "ReserveStatus" DEFAULT 'UNRESERVED',
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "Reserve_pkey" PRIMARY KEY ("id")
);

-- AddForeignKey
ALTER TABLE "Reserve" ADD CONSTRAINT "Reserve_userId_fkey" FOREIGN KEY ("userId") REFERENCES "user"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Reserve" ADD CONSTRAINT "Reserve_eventId_fkey" FOREIGN KEY ("eventId") REFERENCES "event"("id") ON DELETE SET NULL ON UPDATE CASCADE;
