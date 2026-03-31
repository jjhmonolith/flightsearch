import { describe, it, expect } from "vitest";
import { deduplicateFlights } from "./flight-deduplicator";
import type { Flight } from "@/models/flight";

const makeFlight = (
  id: string,
  source: string,
  amount: number
): Flight => ({
  id,
  outbound: {
    segments: [
      {
        departureAirport: "ICN",
        arrivalAirport: "NRT",
        departureTime: "2026-05-01T09:00:00.000Z",
        arrivalTime: "2026-05-01T11:30:00.000Z",
        airline: "KE",
        flightNumber: "KE701",
        duration: 150,
      },
    ],
    totalDuration: 150,
    stops: 0,
  },
  returnLeg: {
    segments: [
      {
        departureAirport: "NRT",
        arrivalAirport: "ICN",
        departureTime: "2026-05-08T14:00:00.000Z",
        arrivalTime: "2026-05-08T17:00:00.000Z",
        airline: "KE",
        flightNumber: "KE702",
        duration: 180,
      },
    ],
    totalDuration: 180,
    stops: 0,
  },
  prices: [
    {
      amount,
      currency: "KRW",
      source,
      bookingUrl: `https://${source}.com/book`,
      bookingType: "redirect",
    },
  ],
});

describe("deduplicateFlights", () => {
  it("merges same-ID flights from different sources", () => {
    const flights = [
      makeFlight("flight-1", "serpapi", 285000),
      makeFlight("flight-1", "duffel", 290000),
    ];

    const result = deduplicateFlights(flights);
    expect(result).toHaveLength(1);
    expect(result[0].prices).toHaveLength(2);
    expect(result[0].prices.map((p) => p.source)).toEqual([
      "serpapi",
      "duffel",
    ]);
  });

  it("keeps different flights separate", () => {
    const flights = [
      makeFlight("flight-1", "serpapi", 285000),
      makeFlight("flight-2", "serpapi", 195000),
    ];

    const result = deduplicateFlights(flights);
    expect(result).toHaveLength(2);
  });

  it("does not duplicate same-source prices", () => {
    const flights = [
      makeFlight("flight-1", "serpapi", 285000),
      makeFlight("flight-1", "serpapi", 285000),
    ];

    const result = deduplicateFlights(flights);
    expect(result).toHaveLength(1);
    expect(result[0].prices).toHaveLength(1);
  });

  it("returns empty array for empty input", () => {
    expect(deduplicateFlights([])).toEqual([]);
  });
});
