import type { FlightSourceAdapter } from "./types";
import { createTequilaAdapter } from "./tequila/adapter";
import { createAmadeusAdapter } from "./amadeus/adapter";
import { createSerpApiAdapter } from "./serpapi/adapter";
import { createDuffelAdapter } from "./duffel/adapter";

export function createAdapterRegistry(): readonly FlightSourceAdapter[] {
  const adapters: FlightSourceAdapter[] = [];

  const tequilaKey = process.env.TEQUILA_API_KEY ?? "";
  if (tequilaKey.length > 0) {
    adapters.push(createTequilaAdapter(tequilaKey));
  }

  const amadeusId = process.env.AMADEUS_CLIENT_ID ?? "";
  const amadeusSecret = process.env.AMADEUS_CLIENT_SECRET ?? "";
  if (amadeusId.length > 0 && amadeusSecret.length > 0) {
    adapters.push(createAmadeusAdapter(amadeusId, amadeusSecret));
  }

  const serpApiKey = process.env.SERPAPI_KEY ?? "";
  if (serpApiKey.length > 0) {
    adapters.push(createSerpApiAdapter(serpApiKey));
  }

  const duffelToken = process.env.DUFFEL_API_TOKEN ?? "";
  if (duffelToken.length > 0) {
    adapters.push(createDuffelAdapter(duffelToken));
  }

  return adapters;
}
