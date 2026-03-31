import type { FlightSourceAdapter, FlightSearchParams } from "@/adapters/types";
import type { Flight } from "@/models/flight";
import { fetchDuffelFlights } from "./client";
import { mapDuffelResponse } from "./mapper";

export function createDuffelAdapter(apiToken: string): FlightSourceAdapter {
  return {
    name: "duffel",

    async search(params: FlightSearchParams): Promise<readonly Flight[]> {
      const rawResponse = await fetchDuffelFlights(params, apiToken);
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
      const response = rawResponse as any;

      if (!response.data?.offers || !Array.isArray(response.data.offers)) {
        return [];
      }

      return mapDuffelResponse(response);
    },

    isAvailable(): boolean {
      return apiToken.length > 0;
    },
  };
}
