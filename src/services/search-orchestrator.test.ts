import { describe, it, expect, vi } from "vitest";
import { searchFlights } from "./search-orchestrator";
import type { FlightSourceAdapter } from "@/adapters/types";
import type { Flight } from "@/models/flight";

const makeMockFlight = (id: string, price: number, source: string): Flight => ({
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
      amount: price,
      currency: "KRW",
      source,
      bookingUrl: `https://${source}.com/book`,
      bookingType: "redirect",
    },
  ],
});

function createMockAdapter(
  name: string,
  flights: Flight[],
  available = true
): FlightSourceAdapter {
  return {
    name,
    search: vi.fn().mockResolvedValue(flights),
    isAvailable: () => available,
  };
}

const baseRequest = {
  departureCity: "ICN",
  destinationCities: ["NRT"],
  departureDate: "2026-05-01",
  returnDate: "2026-05-08",
  passengers: 1,
  cabinClass: "economy" as const,
  currency: "KRW",
  outboundStopovers: [],
  returnStopovers: [],
};

describe("searchFlights", () => {
  it("returns flights sorted by price", async () => {
    const adapter = createMockAdapter("tequila", [
      makeMockFlight("f1", 300000, "tequila"),
      makeMockFlight("f2", 195000, "tequila"),
    ]);

    const result = await searchFlights(baseRequest, [adapter]);

    expect(result.flights).toHaveLength(2);
    expect(result.flights[0].prices[0].amount).toBe(195000);
    expect(result.flights[1].prices[0].amount).toBe(300000);
    expect(result.errors).toHaveLength(0);
  });

  it("handles adapter failure gracefully", async () => {
    const failingAdapter: FlightSourceAdapter = {
      name: "failing",
      search: vi.fn().mockRejectedValue(new Error("API down")),
      isAvailable: () => true,
    };
    const workingAdapter = createMockAdapter("tequila", [
      makeMockFlight("f1", 285000, "tequila"),
    ]);

    const result = await searchFlights(baseRequest, [
      failingAdapter,
      workingAdapter,
    ]);

    expect(result.flights).toHaveLength(1);
    expect(result.errors).toHaveLength(1);
    expect(result.errors[0].source).toBe("failing");
  });

  it("returns error when no adapters available", async () => {
    const unavailable = createMockAdapter("test", [], false);
    const result = await searchFlights(baseRequest, [unavailable]);

    expect(result.flights).toHaveLength(0);
    expect(result.errors).toHaveLength(1);
    expect(result.errors[0].source).toBe("system");
  });

  it("searches multiple destinations in parallel", async () => {
    const adapter = createMockAdapter("tequila", [
      makeMockFlight("f1", 285000, "tequila"),
    ]);

    const multiDestRequest = {
      ...baseRequest,
      destinationCities: ["NRT", "KIX"],
    };

    const result = await searchFlights(multiDestRequest, [adapter]);

    expect(adapter.search).toHaveBeenCalledTimes(2);
    // Duplicated flights get merged
    expect(result.flights.length).toBeGreaterThanOrEqual(1);
  });

  it("includes searchedAt timestamp", async () => {
    const adapter = createMockAdapter("tequila", []);
    const result = await searchFlights(baseRequest, [adapter]);

    expect(result.searchedAt).toBeDefined();
    expect(new Date(result.searchedAt).getTime()).not.toBeNaN();
  });

  it("deduplicates flights from multiple sources", async () => {
    const adapter1 = createMockAdapter("tequila", [
      makeMockFlight("same-id", 285000, "tequila"),
    ]);
    const adapter2 = createMockAdapter("amadeus", [
      makeMockFlight("same-id", 290000, "amadeus"),
    ]);

    const result = await searchFlights(baseRequest, [adapter1, adapter2]);

    expect(result.flights).toHaveLength(1);
    expect(result.flights[0].prices).toHaveLength(2);
  });
});
