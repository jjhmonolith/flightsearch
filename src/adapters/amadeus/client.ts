import type { FlightSearchParams } from "@/adapters/types";
import { getAccessToken } from "./auth";

const FLIGHT_OFFERS_URL =
  "https://api.amadeus.com/v2/shopping/flight-offers";

const CABIN_CLASS_MAP: Record<string, string> = {
  economy: "ECONOMY",
  premium_economy: "PREMIUM_ECONOMY",
  business: "BUSINESS",
  first: "FIRST",
};

export async function fetchAmadeusFlights(
  params: FlightSearchParams,
  clientId: string,
  clientSecret: string
): Promise<unknown> {
  const token = await getAccessToken(clientId, clientSecret);

  const url = new URL(FLIGHT_OFFERS_URL);
  url.searchParams.set("originLocationCode", params.departureCity);
  url.searchParams.set("destinationLocationCode", params.destinationCity);
  url.searchParams.set("departureDate", params.departureDate);
  if (params.returnDate) {
    url.searchParams.set("returnDate", params.returnDate);
  }
  url.searchParams.set("adults", String(params.passengers));
  url.searchParams.set(
    "travelClass",
    CABIN_CLASS_MAP[params.cabinClass] ?? "ECONOMY"
  );
  url.searchParams.set("currencyCode", params.currency);
  url.searchParams.set("max", "20");

  const response = await fetch(url.toString(), {
    headers: {
      Authorization: `Bearer ${token}`,
      Accept: "application/json",
    },
    signal: AbortSignal.timeout(15000),
  });

  if (!response.ok) {
    const body = await response.text().catch(() => "unknown error");
    throw new Error(
      `Amadeus API error: ${response.status} ${response.statusText} - ${body}`
    );
  }

  return response.json();
}
