import type { Flight } from "@/models/flight";

export interface FlightSearchParams {
  readonly departureCity: string;
  readonly destinationCity: string;
  readonly departureDate: string;
  readonly returnDate?: string;
  readonly returnCity?: string;
  readonly passengers: number;
  readonly cabinClass: string;
  readonly currency: string;
}

export interface FlightSourceAdapter {
  readonly name: string;
  search(params: FlightSearchParams): Promise<readonly Flight[]>;
  isAvailable(): boolean;
}
