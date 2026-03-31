import type { FlightSourceAdapter, FlightSearchParams } from "@/adapters/types";
import type { Flight } from "@/models/flight";
import { fetchSerpApiOutbound, fetchSerpApiReturn } from "./client";
import { mapSerpApiFlights, mapSerpApiOneWay } from "./mapper";

export function createSerpApiAdapter(apiKey: string): FlightSourceAdapter {
  return {
    name: "serpapi",

    async search(params: FlightSearchParams): Promise<readonly Flight[]> {
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
      const outboundRaw = (await fetchSerpApiOutbound(params, apiKey)) as any;

      const outboundGroups = [
        ...(outboundRaw.best_flights ?? []),
        ...(outboundRaw.other_flights ?? []),
      ];

      if (outboundGroups.length === 0) {
        return [];
      }

      // One-way search (no returnDate)
      if (!params.returnDate) {
        return mapSerpApiOneWay(outboundRaw, params.currency);
      }

      // Round-trip: get return flights
      const departureToken = outboundGroups[0]?.departure_token;
      if (!departureToken) {
        return [];
      }

      // eslint-disable-next-line @typescript-eslint/no-explicit-any
      const returnRaw = (await fetchSerpApiReturn(
        params,
        departureToken,
        apiKey
      )) as any;

      return mapSerpApiFlights(outboundRaw, returnRaw, params.currency);
    },

    isAvailable(): boolean {
      return apiKey.length > 0;
    },
  };
}
