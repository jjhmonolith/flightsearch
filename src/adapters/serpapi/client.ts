import type { FlightSearchParams } from "@/adapters/types";

const SERPAPI_BASE_URL = "https://serpapi.com/search.json";
const TIMEOUT_MS = 30000;
const MAX_RETRIES = 2;
const RETRY_DELAY_MS = 1500;

const CABIN_CLASS_MAP: Record<string, number> = {
  economy: 1,
  premium_economy: 2,
  business: 3,
  first: 4,
};

async function fetchWithRetry(url: string): Promise<Response> {
  let lastError: Error | null = null;

  for (let attempt = 0; attempt <= MAX_RETRIES; attempt++) {
    try {
      const response = await fetch(url, {
        signal: AbortSignal.timeout(TIMEOUT_MS),
      });
      if (response.ok) return response;

      // Don't retry 4xx client errors (except 429 rate limit)
      if (response.status >= 400 && response.status < 500 && response.status !== 429) {
        const body = await response.text().catch(() => "unknown error");
        throw new Error(`SerpApi error: ${response.status} ${response.statusText} - ${body}`);
      }

      lastError = new Error(`SerpApi error: ${response.status} ${response.statusText}`);
    } catch (error) {
      lastError = error instanceof Error ? error : new Error(String(error));
      // Don't retry non-timeout, non-network errors
      if (lastError.message.includes("SerpApi error: 4")) throw lastError;
    }

    if (attempt < MAX_RETRIES) {
      await new Promise((resolve) => setTimeout(resolve, RETRY_DELAY_MS * (attempt + 1)));
    }
  }

  throw lastError ?? new Error("SerpApi request failed after retries");
}

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

  const response = await fetchWithRetry(url.toString());
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

  const response = await fetchWithRetry(url.toString());
  return response.json();
}
