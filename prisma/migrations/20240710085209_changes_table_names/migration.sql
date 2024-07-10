/*
  Warnings:

  - You are about to drop the `Favorite` table. If the table is not empty, all the data it contains will be lost.
  - You are about to drop the `ItemAddress` table. If the table is not empty, all the data it contains will be lost.
  - You are about to drop the `ItemCategory` table. If the table is not empty, all the data it contains will be lost.
  - You are about to drop the `ItemImage` table. If the table is not empty, all the data it contains will be lost.
  - You are about to drop the `Reserve` table. If the table is not empty, all the data it contains will be lost.

*/
-- DropForeignKey
ALTER TABLE "Favorite" DROP CONSTRAINT "Favorite_itemId_fkey";

-- DropForeignKey
ALTER TABLE "Favorite" DROP CONSTRAINT "Favorite_userId_fkey";

-- DropForeignKey
ALTER TABLE "ItemImage" DROP CONSTRAINT "ItemImage_itemId_fkey";

-- DropForeignKey
ALTER TABLE "Reserve" DROP CONSTRAINT "Reserve_eventId_fkey";

-- DropForeignKey
ALTER TABLE "Reserve" DROP CONSTRAINT "Reserve_userId_fkey";

-- DropForeignKey
ALTER TABLE "item" DROP CONSTRAINT "item_itemAddressId_fkey";

-- DropForeignKey
ALTER TABLE "item" DROP CONSTRAINT "item_itemCategoryId_fkey";

-- DropTable
DROP TABLE "Favorite";

-- DropTable
DROP TABLE "ItemAddress";

-- DropTable
DROP TABLE "ItemCategory";

-- DropTable
DROP TABLE "ItemImage";

-- DropTable
DROP TABLE "Reserve";

-- CreateTable
CREATE TABLE "item_address" (
    "id" TEXT NOT NULL,
    "longitude" DECIMAL(65,30) NOT NULL,
    "latitude" DECIMAL(65,30) NOT NULL,
    "city" TEXT NOT NULL,
    "state" TEXT NOT NULL,
    "country" TEXT NOT NULL,
    "address" TEXT NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "item_address_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "item_image" (
    "id" TEXT NOT NULL,
    "url" TEXT NOT NULL,
    "sequence" INTEGER NOT NULL DEFAULT 0,
    "itemId" TEXT,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "item_image_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "item_category" (
    "id" TEXT NOT NULL,
    "name" TEXT,
    "type" "ItemRole",
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "item_category_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "favorite" (
    "id" TEXT NOT NULL,
    "userId" TEXT,
    "itemId" TEXT,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "favorite_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "reserve" (
    "id" TEXT NOT NULL,
    "userId" TEXT,
    "eventId" TEXT,
    "status" "ReserveStatus" DEFAULT 'UNRESERVED',
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "reserve_pkey" PRIMARY KEY ("id")
);

-- AddForeignKey
ALTER TABLE "item" ADD CONSTRAINT "item_itemCategoryId_fkey" FOREIGN KEY ("itemCategoryId") REFERENCES "item_category"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "item" ADD CONSTRAINT "item_itemAddressId_fkey" FOREIGN KEY ("itemAddressId") REFERENCES "item_address"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "item_image" ADD CONSTRAINT "item_image_itemId_fkey" FOREIGN KEY ("itemId") REFERENCES "item"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "favorite" ADD CONSTRAINT "favorite_userId_fkey" FOREIGN KEY ("userId") REFERENCES "user"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "favorite" ADD CONSTRAINT "favorite_itemId_fkey" FOREIGN KEY ("itemId") REFERENCES "item"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "reserve" ADD CONSTRAINT "reserve_userId_fkey" FOREIGN KEY ("userId") REFERENCES "user"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "reserve" ADD CONSTRAINT "reserve_eventId_fkey" FOREIGN KEY ("eventId") REFERENCES "event"("id") ON DELETE SET NULL ON UPDATE CASCADE;
