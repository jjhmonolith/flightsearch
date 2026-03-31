import type { FlightSearchParams } from "@/adapters/types";

const SERPAPI_BASE_URL = "https://serpapi.com/search.json";

const CABIN_CLASS_MAP: Record<string, number> = {
  economy: 1,
  premium_economy: 2,
  business: 3,
  first: 4,
};

/**
 * Fetch outbound flights from SerpApi Google Flights.
 */
export async function fetchSerpApiOutbound(
  params: FlightSearchParams,
  apiKey: string
): Promise<unknown> {
  const url = new URL(SERPAPI_BASE_URL);
  url.searchParams.set("engine", "google_flights");
  url.searchParams.set("departure_id", params.departureCity);
  url.searchParams.set("arrival_id", params.destinationCity);
  url.searchParams.set("outbound_date", params.departureDate);
  if (params.returnDate) {
    url.searchParams.set("return_date", params.returnDate);
  }
  url.searchParams.set("currency", params.currency);
  url.searchParams.set("adults", String(params.passengers));
  url.searchParams.set(
    "travel_class",
    String(CABIN_CLASS_MAP[params.cabinClass] ?? 1)
  );
  url.searchParams.set("type", params.returnDate ? "1" : "2"); // 1=round trip, 2=one way
  url.searchParams.set("api_key", apiKey);

  const response = await fetch(url.toString(), {
    signal: AbortSignal.timeout(20000),
  });

  if (!response.ok) {
    const body = await response.text().catch(() => "unknown error");
    throw new Error(
      `SerpApi error: ${response.status} ${response.statusText} - ${body}`
    );
  }

  return response.json();
}

/**
 * Fetch return flights using a departure_token from the outbound response.
 */
export async function fetchSerpApiReturn(
  params: FlightSearchParams,
  departureToken: string,
  apiKey: string
): Promise<unknown> {
  const url = new URL(SERPAPI_BASE_URL);
  url.searchParams.set("engine", "google_flights");
  url.searchParams.set("departure_id", params.departureCity);
  url.searchParams.set("arrival_id", params.destinationCity);
  url.searchParams.set("outbound_date", params.departureDate);
  if (params.returnDate) {
    url.searchParams.set("return_date", params.returnDate);
  }
  url.searchParams.set("currency", params.currency);
  url.searchParams.set("type", "1");
  url.searchParams.set("departure_token", departureToken);
  url.searchParams.set("api_key", apiKey);

  const response = await fetch(url.toString(), {
    signal: AbortSignal.timeout(20000),
  });

  if (!response.ok) {
    const body = await response.text().catch(() => "unknown error");
    throw new Error(
      `SerpApi return flights error: ${response.status} - ${body}`
    );
  }

  return response.json();
}
