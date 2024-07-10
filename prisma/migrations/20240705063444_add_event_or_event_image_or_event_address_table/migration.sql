-- CreateEnum
CREATE TYPE "Status" AS ENUM ('PENDING', 'APPROVED', 'DISAPPROVED', 'EXPIRED');

-- AlterTable
ALTER TABLE "user" ADD COLUMN     "eventId" TEXT;

-- CreateTable
CREATE TABLE "event" (
    "id" TEXT NOT NULL,
    "title" TEXT NOT NULL,
    "description" TEXT NOT NULL,
    "photoUrl" TEXT NOT NULL,
    "eventAddressId" TEXT,
    "userId" TEXT NOT NULL,
    "eventDate" TIMESTAMP(3) NOT NULL,
    "startDateTime" TIMESTAMP(3) NOT NULL,
    "endDateTime" TIMESTAMP(3) NOT NULL,
    "status" "Status" DEFAULT 'PENDING',
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "event_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "event_image" (
    "id" TEXT NOT NULL,
    "photoUrl" TEXT[],
    "sequence" INTEGER NOT NULL DEFAULT 0,
    "eventId" TEXT,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "event_image_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "event_address" (
    "id" TEXT NOT NULL,
    "longitude" DECIMAL(65,30) NOT NULL,
    "latitude" DECIMAL(65,30) NOT NULL,
    "city" TEXT NOT NULL,
    "state" TEXT NOT NULL,
    "country" TEXT NOT NULL,
    "address" TEXT NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "event_address_pkey" PRIMARY KEY ("id")
);

-- AddForeignKey
ALTER TABLE "event" ADD CONSTRAINT "event_eventAddressId_fkey" FOREIGN KEY ("eventAddressId") REFERENCES "event_address"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "event" ADD CONSTRAINT "event_userId_fkey" FOREIGN KEY ("userId") REFERENCES "user"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "event_image" ADD CONSTRAINT "event_image_eventId_fkey" FOREIGN KEY ("eventId") REFERENCES "event"("id") ON DELETE SET NULL ON UPDATE CASCADE;
