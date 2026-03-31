import type { FlightLeg } from "@/models/flight";

/**
 * Generates a deterministic flight ID from outbound and return legs.
 * Uses flight numbers and departure times to uniquely identify a route.
 */
export function generateFlightId(
  outbound: FlightLeg,
  returnLeg: FlightLeg
): string {
  const outboundKey = outbound.segments
    .map((s) => `${s.flightNumber}-${s.departureTime}`)
    .join("|");
  const returnKey = returnLeg.segments
    .map((s) => `${s.flightNumber}-${s.departureTime}`)
    .join("|");
  return `${outboundKey}::${returnKey}`;
}
