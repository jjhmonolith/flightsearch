import type { FlightSourceAdapter, FlightSearchParams } from "@/adapters/types";
import type { Flight } from "@/models/flight";
import { fetchAmadeusFlights } from "./client";
import { mapAmadeusResponse } from "./mapper";

export function createAmadeusAdapter(
  clientId: string,
  clientSecret: string
): FlightSourceAdapter {
  return {
    name: "amadeus",

    async search(params: FlightSearchParams): Promise<readonly Flight[]> {
      const rawResponse = await fetchAmadeusFlights(
        params,
        clientId,
        clientSecret
      );
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
      const response = rawResponse as any;

      if (!response.data || !Array.isArray(response.data)) {
        return [];
      }

      return mapAmadeusResponse(response);
    },

    isAvailable(): boolean {
      return clientId.length > 0 && clientSecret.length > 0;
    },
  };
}
