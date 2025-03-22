/*
  Warnings:

  - Changed the type of `vehicle` on the `Ticket` table. No cast exists, the column would be dropped and recreated, which cannot be done if there is data, since the column is required.

*/
-- CreateEnum
CREATE TYPE "VehicleType" AS ENUM ('toyota', 'minibus', 'sienna');

-- AlterTable
ALTER TABLE "Ticket" DROP COLUMN "vehicle",
ADD COLUMN     "vehicle" "VehicleType" NOT NULL;

-- DropEnum
DROP TYPE "Vehicle";
