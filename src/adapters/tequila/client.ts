import type { FlightSearchParams } from "@/adapters/types";

const TEQUILA_BASE_URL = "https://api.tequila.kiwi.com/v2";

interface TequilaSearchParams {
  readonly fly_from: string;
  readonly fly_to: string;
  readonly date_from: string;
  readonly date_to: string;
  readonly return_from: string;
  readonly return_to: string;
  readonly adults: number;
  readonly selected_cabins: string;
  readonly curr: string;
  readonly flight_type: "round" | "oneway";
  readonly one_for_city: number;
  readonly max_stopovers: number;
  readonly limit: number;
}

const CABIN_CLASS_MAP: Record<string, string> = {
  economy: "M",
  premium_economy: "W",
  business: "C",
  first: "F",
};

function formatDate(isoDate: string): string {
  const [year, month, day] = isoDate.split("-");
  return `${day}/${month}/${year}`;
}

function buildSearchParams(params: FlightSearchParams): TequilaSearchParams {
  const formattedDeparture = formatDate(params.departureDate);
  const formattedReturn = params.returnDate
    ? formatDate(params.returnDate)
    : "";

  return {
    fly_from: params.departureCity,
    fly_to: params.destinationCity,
    date_from: formattedDeparture,
    date_to: formattedDeparture,
    return_from: formattedReturn,
    return_to: formattedReturn,
    adults: params.passengers,
    selected_cabins: CABIN_CLASS_MAP[params.cabinClass] ?? "M",
    curr: params.currency,
    flight_type: params.returnDate ? "round" : "oneway",
    one_for_city: 0,
    max_stopovers: 2,
    limit: 20,
  };
}

export async function fetchTequilaFlights(
  params: FlightSearchParams,
  apiKey: string
): Promise<unknown> {
  const searchParams = buildSearchParams(params);
  const url = new URL(`${TEQUILA_BASE_URL}/search`);

  for (const [key, value] of Object.entries(searchParams)) {
    url.searchParams.set(key, String(value));
  }

  const response = await fetch(url.toString(), {
    headers: {
      apikey: apiKey,
      accept: "application/json",
    },
    signal: AbortSignal.timeout(15000),
  });

  if (!response.ok) {
    const body = await response.text().catch(() => "unknown error");
    throw new Error(
      `Tequila API error: ${response.status} ${response.statusText} - ${body}`
    );
  }

  return response.json();
}
