import type { Flight } from "@/models/flight";

export type SortField = "price" | "duration" | "stops";
export type SortDirection = "asc" | "desc";

function getLowestPrice(flight: Flight): number {
  return Math.min(...flight.prices.map((p) => p.amount));
}

function getTotalDuration(flight: Flight): number {
  return flight.outbound.totalDuration + (flight.returnLeg?.totalDuration ?? 0);
}

function getTotalStops(flight: Flight): number {
  return flight.outbound.stops + (flight.returnLeg?.stops ?? 0);
}

const SORT_EXTRACTORS: Record<SortField, (flight: Flight) => number> = {
  price: getLowestPrice,
  duration: getTotalDuration,
  stops: getTotalStops,
};

export function sortFlights(
  flights: readonly Flight[],
  field: SortField = "price",
  direction: SortDirection = "asc"
): readonly Flight[] {
  const extractor = SORT_EXTRACTORS[field];
  const multiplier = direction === "asc" ? 1 : -1;

  return [...flights].sort((a, b) => {
    return (extractor(a) - extractor(b)) * multiplier;
  });
}
