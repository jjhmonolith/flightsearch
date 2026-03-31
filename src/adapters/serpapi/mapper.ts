import type { Flight, FlightLeg, Segment, Price } from "@/models/flight";
import { generateFlightId } from "@/lib/flight-id";

interface SerpApiFlight {
  readonly departure_airport: { readonly id: string; readonly time: string };
  readonly arrival_airport: { readonly id: string; readonly time: string };
  readonly duration: number;
  readonly airline: string;
  readonly flight_number: string;
}

interface SerpApiFlightGroup {
  readonly flights: readonly SerpApiFlight[];
  readonly total_duration: number;
  readonly price: number;
  readonly booking_token?: string;
}

interface SerpApiResponse {
  readonly search_metadata?: {
    readonly google_flights_url?: string;
  };
  readonly best_flights?: readonly SerpApiFlightGroup[];
  readonly other_flights?: readonly SerpApiFlightGroup[];
}

const GOOGLE_FLIGHTS_BASE = "https://www.google.com/travel/flights";

function parseFlightTime(timeStr: string): string {
  // SerpApi format: "2026-05-01 09:00" — already local time
  return timeStr.replace(" ", "T") + ":00";
}

function extractAirlineCode(flightNumber: string): string {
  // "KE 701" → "KE"
  const parts = flightNumber.split(" ");
  return parts[0] ?? flightNumber;
}

function normalizeFlightNumber(flightNumber: string): string {
  // "KE 701" → "KE701"
  return flightNumber.replace(/\s+/g, "");
}

function mapSegment(flight: SerpApiFlight): Segment {
  return {
    departureAirport: flight.departure_airport.id,
    arrivalAirport: flight.arrival_airport.id,
    departureTime: parseFlightTime(flight.departure_airport.time),
    arrivalTime: parseFlightTime(flight.arrival_airport.time),
    airline: extractAirlineCode(flight.flight_number),
    flightNumber: normalizeFlightNumber(flight.flight_number),
    duration: flight.duration,
  };
}

function buildLeg(group: SerpApiFlightGroup): FlightLeg {
  const segments = group.flights.map(mapSegment);
  return {
    segments,
    totalDuration: group.total_duration,
    stops: segments.length - 1,
  };
}

function buildBookingUrl(googleFlightsUrl?: string): string {
  return googleFlightsUrl ?? GOOGLE_FLIGHTS_BASE;
}

function buildPrice(
  group: SerpApiFlightGroup,
  currency: string,
  bookingUrl: string
): Price {
  return {
    amount: group.price,
    currency,
    source: "serpapi",
    bookingUrl,
    bookingType: "redirect",
  };
}

/**
 * Maps SerpApi Google Flights results to Flight objects.
 *
 * SerpApi returns outbound and return flights separately.
 * We pair each outbound with the best (first) return flight.
 */
export function mapSerpApiFlights(
  outboundResponse: SerpApiResponse,
  returnResponse: SerpApiResponse,
  currency: string
): readonly Flight[] {
  const outboundGroups = [
    ...(outboundResponse.best_flights ?? []),
    ...(outboundResponse.other_flights ?? []),
  ];

  if (outboundGroups.length === 0) {
    return [];
  }

  // Use the first return flight group as the return leg
  const returnGroups = [
    ...(returnResponse.best_flights ?? []),
    ...(returnResponse.other_flights ?? []),
  ];

  if (returnGroups.length === 0) {
    return [];
  }

  const returnLeg = buildLeg(returnGroups[0]);
  const bookingUrl = buildBookingUrl(
    outboundResponse.search_metadata?.google_flights_url
  );

  return outboundGroups.map((group) => {
    const outbound = buildLeg(group);

    return {
      id: generateFlightId(outbound, returnLeg),
      outbound,
      returnLeg,
      prices: [buildPrice(group, currency, bookingUrl)],
    };
  });
}

/**
 * Maps SerpApi one-way flight results (no return leg).
 */
export function mapSerpApiOneWay(
  response: SerpApiResponse,
  currency: string
): readonly Flight[] {
  const groups = [
    ...(response.best_flights ?? []),
    ...(response.other_flights ?? []),
  ];

  const bookingUrl = buildBookingUrl(
    response.search_metadata?.google_flights_url
  );

  return groups.map((group) => {
    const outbound = buildLeg(group);
    const id = outbound.segments
      .map((s) => `${s.flightNumber}-${s.departureTime}`)
      .join("|");

    return {
      id,
      outbound,
      prices: [buildPrice(group, currency, bookingUrl)],
    };
  });
}
