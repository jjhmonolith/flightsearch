import type { FlightSourceAdapter } from "./types";
import { createSerpApiAdapter } from "./serpapi/adapter";
import { createDuffelAdapter } from "./duffel/adapter";

export function createAdapterRegistry(): readonly FlightSourceAdapter[] {
  const adapters: FlightSourceAdapter[] = [];

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
