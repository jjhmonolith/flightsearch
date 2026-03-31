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
              destination: params.returnCity ?? params.departureCity,
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
      currency: params.currency,
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

/**
 * Create a Duffel Links booking URL for an offer.
 */
export async function createDuffelLink(
  offerId: string,
  apiToken: string
): Promise<string> {
  const response = await fetch(`${DUFFEL_BASE_URL}/links/sessions`, {
    method: "POST",
    headers: {
      Authorization: `Bearer ${apiToken}`,
      "Content-Type": "application/json",
      "Duffel-Version": "v2",
      Accept: "application/json",
    },
    body: JSON.stringify({
      data: {
        offer_id: offerId,
        markup_amount: "0.00",
        markup_currency: "KRW",
      },
    }),
    signal: AbortSignal.timeout(10000),
  });

  if (!response.ok) {
    return `https://duffel.com`;
  }

  const result = await response.json() as { data?: { url?: string } };
  return result.data?.url ?? "https://duffel.com";
}
