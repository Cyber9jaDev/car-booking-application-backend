/*
  Warnings:

  - The values [lagos,kano,abuja,ibadan,ph,aba,onitsha,benin,shagamu,ogbomoso,owerri,ikeja,osogbo,agege,ilesa,oshodi,surulere,ikoyi,warri,akure,ekiti,osun] on the enum `City` will be removed. If these variants are still used in the database, this will fail.
  - The values [toyota,minibus,sienna] on the enum `VehicleType` will be removed. If these variants are still used in the database, this will fail.
  - Added the required column `createdById` to the `Ticket` table without a default value. This is not possible if the table is not empty.

*/
-- CreateEnum
CREATE TYPE "BookingStatus" AS ENUM ('PENDING', 'CONFIRMED', 'CANCELLED');

-- AlterEnum
BEGIN;
CREATE TYPE "City_new" AS ENUM ('LAGOS', 'KANO', 'ABUJA', 'IBADAN', 'PORT_HARCOURT', 'ABA', 'ONITSHA', 'BENIN', 'SHAGAMU', 'OGBOMOSO', 'OWERRI', 'IKEJA', 'OSOGBO', 'AGEGE', 'ILESA', 'OSHODI', 'SURULERE', 'IKOYI', 'WARRI', 'AKURE', 'EKITI', 'OSUN');
ALTER TABLE "Ticket" ALTER COLUMN "departureCity" TYPE "City_new" USING ("departureCity"::text::"City_new");
ALTER TABLE "Ticket" ALTER COLUMN "arrivalCity" TYPE "City_new" USING ("arrivalCity"::text::"City_new");
ALTER TYPE "City" RENAME TO "City_old";
ALTER TYPE "City_new" RENAME TO "City";
DROP TYPE "City_old";
COMMIT;

-- AlterEnum
BEGIN;
CREATE TYPE "VehicleType_new" AS ENUM ('TOYOTA', 'MINIBUS', 'SIENNA');
ALTER TABLE "Ticket" ALTER COLUMN "vehicleType" TYPE "VehicleType_new" USING ("vehicleType"::text::"VehicleType_new");
ALTER TYPE "VehicleType" RENAME TO "VehicleType_old";
ALTER TYPE "VehicleType_new" RENAME TO "VehicleType";
DROP TYPE "VehicleType_old";
COMMIT;

-- AlterTable
ALTER TABLE "Ticket" ADD COLUMN     "createdById" TEXT NOT NULL;

-- CreateTable
CREATE TABLE "Booking" (
    "id" TEXT NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "Booking_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "_TicketToUser" (
    "A" TEXT NOT NULL,
    "B" TEXT NOT NULL,

    CONSTRAINT "_TicketToUser_AB_pkey" PRIMARY KEY ("A","B")
);

-- CreateIndex
CREATE INDEX "_TicketToUser_B_index" ON "_TicketToUser"("B");

-- AddForeignKey
ALTER TABLE "Ticket" ADD CONSTRAINT "Ticket_createdById_fkey" FOREIGN KEY ("createdById") REFERENCES "User"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "_TicketToUser" ADD CONSTRAINT "_TicketToUser_A_fkey" FOREIGN KEY ("A") REFERENCES "Ticket"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "_TicketToUser" ADD CONSTRAINT "_TicketToUser_B_fkey" FOREIGN KEY ("B") REFERENCES "User"("id") ON DELETE CASCADE ON UPDATE CASCADE;
