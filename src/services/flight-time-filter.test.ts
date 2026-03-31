import { describe, it, expect } from "vitest";
import { filterFlightsByTime } from "./flight-time-filter";
import type { Flight } from "@/models/flight";

function makeFlight(
  outboundDepartureTime: string,
  returnDepartureTime: string
): Flight {
  return {
    id: `flight-${outboundDepartureTime}`,
    outbound: {
      segments: [
        {
          departureAirport: "ICN",
          arrivalAirport: "NRT",
          departureTime: outboundDepartureTime,
          arrivalTime: "2026-05-01T11:30:00",
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
          departureTime: returnDepartureTime,
          arrivalTime: "2026-05-08T17:00:00",
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
        amount: 285000,
        currency: "KRW",
        source: "serpapi",
        bookingUrl: "https://example.com",
        bookingType: "redirect",
      },
    ],
  };
}

describe("filterFlightsByTime", () => {
  const flights = [
    makeFlight("2026-05-01T06:00:00", "2026-05-08T09:00:00"),
    makeFlight("2026-05-01T09:00:00", "2026-05-08T14:00:00"),
    makeFlight("2026-05-01T14:00:00", "2026-05-08T18:00:00"),
    makeFlight("2026-05-01T20:00:00", "2026-05-08T21:00:00"),
  ];

  it("returns all flights when no time range is set", () => {
    const result = filterFlightsByTime(flights);
    expect(result).toHaveLength(4);
  });

  it("filters by departure time range", () => {
    const result = filterFlightsByTime(flights, { from: "08:00", to: "15:00" });
    expect(result).toHaveLength(2);
    expect(result[0].outbound.segments[0].departureTime).toContain("09:00");
    expect(result[1].outbound.segments[0].departureTime).toContain("14:00");
  });

  it("filters by return time range", () => {
    const result = filterFlightsByTime(flights, undefined, {
      from: "13:00",
      to: "19:00",
    });
    expect(result).toHaveLength(2);
  });

  it("filters by both departure and return time ranges", () => {
    const result = filterFlightsByTime(
      flights,
      { from: "08:00", to: "15:00" },
      { from: "13:00", to: "19:00" }
    );
    expect(result).toHaveLength(2);
  });

  it("returns empty when no flights match", () => {
    const result = filterFlightsByTime(flights, { from: "23:00", to: "23:59" });
    expect(result).toHaveLength(0);
  });
});
