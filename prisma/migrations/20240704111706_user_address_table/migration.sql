-- CreateTable
CREATE TABLE "user_address" (
    "id" TEXT NOT NULL,
    "address" TEXT,
    "city" TEXT,
    "state" TEXT,
    "country" TEXT,
    "zipCode" TEXT NOT NULL,
    "latitude" DOUBLE PRECISION,
    "longitude" DOUBLE PRECISION,
    "userId" TEXT NOT NULL,

    CONSTRAINT "user_address_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "user_address_userId_key" ON "user_address"("userId");

-- AddForeignKey
ALTER TABLE "user_address" ADD CONSTRAINT "user_address_userId_fkey" FOREIGN KEY ("userId") REFERENCES "User"("id") ON DELETE CASCADE ON UPDATE CASCADE;
