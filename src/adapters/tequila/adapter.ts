import type { FlightSourceAdapter, FlightSearchParams } from "@/adapters/types";
import type { Flight } from "@/models/flight";
import { fetchTequilaFlights } from "./client";
import { mapTequilaResponse } from "./mapper";

export function createTequilaAdapter(apiKey: string): FlightSourceAdapter {
  return {
    name: "tequila",

    async search(params: FlightSearchParams): Promise<readonly Flight[]> {
      const rawResponse = await fetchTequilaFlights(params, apiKey);
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
      const response = rawResponse as any;

      if (!response.data || !Array.isArray(response.data)) {
        return [];
      }

      return mapTequilaResponse(response);
    },

    isAvailable(): boolean {
      return apiKey.length > 0;
    },
  };
}
