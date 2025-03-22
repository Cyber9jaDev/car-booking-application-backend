-- CreateEnum
CREATE TYPE "City" AS ENUM ('lagos', 'kano', 'abuja', 'ibadan', 'ph', 'aba', 'onitsha', 'benin', 'shagamu', 'ogbomoso', 'owerri', 'ikeja', 'osogbo', 'agege', 'ilesa', 'oshodi', 'surulere', 'ikoyi', 'warri', 'akure', 'ekiti', 'osun');

-- CreateEnum
CREATE TYPE "Vehicle" AS ENUM ('toyota', 'minibus', 'sienna');

-- CreateTable
CREATE TABLE "Ticket" (
    "id" TEXT NOT NULL,
    "departureCity" "City" NOT NULL,
    "arrivalCity" "City" NOT NULL,
    "vehicle" "Vehicle" NOT NULL,
    "departureDate" TEXT NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "Ticket_pkey" PRIMARY KEY ("id")
);
