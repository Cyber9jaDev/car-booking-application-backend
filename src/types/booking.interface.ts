import { City, VehicleType } from "@prisma/client";

export type Filter = {
  departureDate? : string;
  departureCity?: City;
  arrivalCity?: City;
}

export interface TicketResponse {
  id: string;
  departureCity: City,
  arrivalCity: City,
  departureDate: string,
  vehicleType: VehicleType,
  ticketFee: number,
  availableSeats: number[],
  createdAt: Date,
  updatedAt: Date,
  createdById: string
}