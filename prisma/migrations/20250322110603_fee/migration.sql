/*
  Warnings:

  - You are about to drop the column `vehicle` on the `Ticket` table. All the data in the column will be lost.
  - Added the required column `ticketFee` to the `Ticket` table without a default value. This is not possible if the table is not empty.
  - Added the required column `vehicleType` to the `Ticket` table without a default value. This is not possible if the table is not empty.

*/
-- AlterTable
ALTER TABLE "Ticket" DROP COLUMN "vehicle",
ADD COLUMN     "ticketFee" INTEGER NOT NULL,
ADD COLUMN     "vehicleType" "VehicleType" NOT NULL;
