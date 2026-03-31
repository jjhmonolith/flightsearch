import type { Flight, FlightLeg, Segment, Price } from "@/models/flight";
import { generateFlightId } from "@/lib/flight-id";

interface TequilaRoute {
  readonly flyFrom: string;
  readonly flyTo: string;
  readonly local_departure: string;
  readonly local_arrival: string;
  readonly airline: string;
  readonly flight_no: number;
  readonly return: number;
}

interface TequilaFlight {
  readonly price: number;
  readonly deep_link: string;
  readonly route: readonly TequilaRoute[];
  readonly duration: {
    readonly departure: number;
    readonly return: number;
  };
}

interface TequilaResponse {
  readonly currency: string;
  readonly data: readonly TequilaFlight[];
}

function computeDurationMinutes(
  departureTime: string,
  arrivalTime: string
): number {
  const dep = new Date(departureTime).getTime();
  const arr = new Date(arrivalTime).getTime();
  return Math.round((arr - dep) / 60000);
}

function toLocalDateTime(dateStr: string): string {
  // Tequila returns local times like "2026-05-01T09:00:00.000Z"
  // Strip trailing Z to preserve as local time
  return dateStr.replace(/\.000Z$/, "").replace(/Z$/, "");
}

function mapSegment(route: TequilaRoute): Segment {
  return {
    departureAirport: route.flyFrom,
    arrivalAirport: route.flyTo,
    departureTime: toLocalDateTime(route.local_departure),
    arrivalTime: toLocalDateTime(route.local_arrival),
    airline: route.airline,
    flightNumber: `${route.airline}${route.flight_no}`,
    duration: computeDurationMinutes(
      route.local_departure,
      route.local_arrival
    ),
  };
}

function buildLeg(
  routes: readonly TequilaRoute[],
  totalDurationSeconds: number
): FlightLeg {
  const segments = routes.map(mapSegment);
  return {
    segments,
    totalDuration: Math.round(totalDurationSeconds / 60),
    stops: segments.length - 1,
  };
}

function mapPrice(
  tequilaFlight: TequilaFlight,
  currency: string
): Price {
  return {
    amount: tequilaFlight.price,
    currency,
    source: "tequila",
    bookingUrl: tequilaFlight.deep_link,
    bookingType: "redirect",
  };
}

export function mapTequilaResponse(response: TequilaResponse): readonly Flight[] {
  return response.data.map((item) => {
    const outboundRoutes = item.route.filter((r) => r.return === 0);
    const returnRoutes = item.route.filter((r) => r.return === 1);

    const outbound = buildLeg(outboundRoutes, item.duration.departure);
    const returnLeg = buildLeg(returnRoutes, item.duration.return);

    return {
      id: generateFlightId(outbound, returnLeg),
      outbound,
      returnLeg,
      prices: [mapPrice(item, response.currency)],
    };
  });
}
