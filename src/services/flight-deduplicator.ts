import type { Flight } from "@/models/flight";

/**
 * Merges flights with the same ID (same route) from different sources.
 * Combines prices from all sources into a single flight entry.
 */
export function deduplicateFlights(
  flights: readonly Flight[]
): readonly Flight[] {
  const flightMap = new Map<string, Flight>();

  for (const flight of flights) {
    const existing = flightMap.get(flight.id);
    if (existing) {
      // Merge prices from different sources, avoiding same-source duplicates
      const existingSources = new Set(existing.prices.map((p) => p.source));
      const newPrices = flight.prices.filter(
        (p) => !existingSources.has(p.source)
      );
      flightMap.set(flight.id, {
        ...existing,
        prices: [...existing.prices, ...newPrices],
      });
    } else {
      flightMap.set(flight.id, flight);
    }
  }

  return Array.from(flightMap.values());
}
