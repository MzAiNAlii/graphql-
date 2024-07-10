-- CreateEnum
CREATE TYPE "Role" AS ENUM ('SUPER_ADMIN', 'ADMIN', 'BUSINESS_OWNER', 'COMMUNITY_MEMBER', 'VENDOR');

-- CreateEnum
CREATE TYPE "ItemRole" AS ENUM ('BUSINESS', 'FREE_STUFF', 'GARAGE', 'VENDOR');

-- AlterTable
ALTER TABLE "event" ALTER COLUMN "updatedAt" SET DEFAULT CURRENT_TIMESTAMP;

-- AlterTable
ALTER TABLE "event_address" ALTER COLUMN "updatedAt" SET DEFAULT CURRENT_TIMESTAMP;

-- AlterTable
ALTER TABLE "event_image" ALTER COLUMN "updatedAt" SET DEFAULT CURRENT_TIMESTAMP;

-- AlterTable
ALTER TABLE "user_address" ADD COLUMN     "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
ADD COLUMN     "updatedAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP;

-- CreateTable
CREATE TABLE "item" (
    "id" TEXT NOT NULL,
    "title" TEXT NOT NULL,
    "email" TEXT,
    "phoneNumber" TEXT,
    "description" TEXT NOT NULL,
    "merchandisePhotoUrl" TEXT,
    "businessLogoUrl" TEXT,
    "setUpPictureUrl" TEXT,
    "itemRole" "ItemRole" NOT NULL,
    "price" DECIMAL(65,30),
    "website" TEXT,
    "availabilityStartDateTime" TIMESTAMP(3),
    "availabilityEndDateTime" TIMESTAMP(3),
    "itemDate" TIMESTAMP(3),
    "status" "Status" DEFAULT 'PENDING',
    "userId" TEXT,
    "userRole" "Role" NOT NULL,
    "itemCategoryId" TEXT,
    "deletionDateTime" TIMESTAMP(3),
    "approvalDateTime" TIMESTAMP(3),
    "itemAddressId" TEXT NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "item_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "ItemAddress" (
    "id" TEXT NOT NULL,
    "longitude" DECIMAL(65,30) NOT NULL,
    "latitude" DECIMAL(65,30) NOT NULL,
    "city" TEXT NOT NULL,
    "state" TEXT NOT NULL,
    "country" TEXT NOT NULL,
    "address" TEXT NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "ItemAddress_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "ItemImage" (
    "id" TEXT NOT NULL,
    "url" TEXT NOT NULL,
    "sequence" INTEGER NOT NULL DEFAULT 0,
    "itemId" TEXT,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "ItemImage_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "ItemCategory" (
    "id" TEXT NOT NULL,
    "name" TEXT,
    "type" "ItemRole",
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "ItemCategory_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "item_itemAddressId_key" ON "item"("itemAddressId");

-- AddForeignKey
ALTER TABLE "item" ADD CONSTRAINT "item_userId_fkey" FOREIGN KEY ("userId") REFERENCES "user"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "item" ADD CONSTRAINT "item_itemCategoryId_fkey" FOREIGN KEY ("itemCategoryId") REFERENCES "ItemCategory"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "item" ADD CONSTRAINT "item_itemAddressId_fkey" FOREIGN KEY ("itemAddressId") REFERENCES "ItemAddress"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "ItemImage" ADD CONSTRAINT "ItemImage_itemId_fkey" FOREIGN KEY ("itemId") REFERENCES "item"("id") ON DELETE SET NULL ON UPDATE CASCADE;
