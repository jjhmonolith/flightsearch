import type { FlightSearchParams } from "@/adapters/types";

const DUFFEL_BASE_URL = "https://api.duffel.com";

const CABIN_CLASS_MAP: Record<string, string> = {
  economy: "economy",
  premium_economy: "premium_economy",
  business: "business",
  first: "first",
};

export async function fetchDuffelFlights(
  params: FlightSearchParams,
  apiToken: string
): Promise<unknown> {
  const body = {
    data: {
      slices: params.returnDate
        ? [
            {
              origin: params.departureCity,
              destination: params.destinationCity,
              departure_date: params.departureDate,
            },
            {
              origin: params.destinationCity,
              destination: params.departureCity,
              departure_date: params.returnDate,
            },
          ]
        : [
            {
              origin: params.departureCity,
              destination: params.destinationCity,
              departure_date: params.departureDate,
            },
          ],
      passengers: Array.from({ length: params.passengers }, () => ({
        type: "adult",
      })),
      cabin_class: CABIN_CLASS_MAP[params.cabinClass] ?? "economy",
      return_offers: true,
    },
  };

  const response = await fetch(
    `${DUFFEL_BASE_URL}/air/offer_requests`,
    {
      method: "POST",
      headers: {
        Authorization: `Bearer ${apiToken}`,
        "Content-Type": "application/json",
        "Duffel-Version": "v2",
        Accept: "application/json",
      },
      body: JSON.stringify(body),
      signal: AbortSignal.timeout(30000),
    }
  );

  if (!response.ok) {
    const errorBody = await response.text().catch(() => "unknown error");
    throw new Error(
      `Duffel API error: ${response.status} ${response.statusText} - ${errorBody}`
    );
  }

  return response.json();
}
