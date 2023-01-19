-- CreateEnum
CREATE TYPE "InventoryItemTypes" AS ENUM ('Computer', 'Furniture', 'Periphery');

-- CreateTable
CREATE TABLE "InventoryItem" (
    "id" SERIAL NOT NULL,
    "name" TEXT NOT NULL,
    "type" "InventoryItemTypes" NOT NULL,
    "employeeId" INTEGER,
    "photoId" INTEGER,

    CONSTRAINT "InventoryItem_pkey" PRIMARY KEY ("id")
);

-- AddForeignKey
ALTER TABLE "InventoryItem" ADD CONSTRAINT "InventoryItem_employeeId_fkey" FOREIGN KEY ("employeeId") REFERENCES "Employee"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "InventoryItem" ADD CONSTRAINT "InventoryItem_photoId_fkey" FOREIGN KEY ("photoId") REFERENCES "StoredFile"("id") ON DELETE SET NULL ON UPDATE CASCADE;
