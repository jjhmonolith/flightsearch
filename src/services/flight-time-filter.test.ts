import { describe, it, expect } from "vitest";
import { filterFlightsByTime } from "./flight-time-filter";
import type { Flight } from "@/models/flight";

function makeFlight(
  outboundDepartureTime: string,
  returnDepartureTime: string,
  outboundDuration = 150,
  returnDuration = 180
): Flight {
  return {
    id: `flight-${outboundDepartureTime}-${outboundDuration}`,
    outbound: {
      segments: [
        {
          departureAirport: "ICN",
          arrivalAirport: "NRT",
          departureTime: outboundDepartureTime,
          arrivalTime: "2026-05-01T11:30:00",
          airline: "KE",
          flightNumber: "KE701",
          duration: outboundDuration,
        },
      ],
      totalDuration: outboundDuration,
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
          duration: returnDuration,
        },
      ],
      totalDuration: returnDuration,
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

describe("filterFlightsByTime - duration filter", () => {
  const flights = [
    makeFlight("2026-05-01T09:00:00", "2026-05-08T14:00:00", 120, 150), // 2h outbound, 2.5h return
    makeFlight("2026-05-01T10:00:00", "2026-05-08T15:00:00", 480, 600), // 8h outbound, 10h return
    makeFlight("2026-05-01T11:00:00", "2026-05-08T16:00:00", 900, 180), // 15h outbound, 3h return
  ];

  it("filters by outbound max duration", () => {
    const result = filterFlightsByTime(flights, undefined, undefined, {
      outboundMaxDurationHours: 10,
    });
    expect(result).toHaveLength(2);
    expect(result[0].outbound.totalDuration).toBe(120);
    expect(result[1].outbound.totalDuration).toBe(480);
  });

  it("filters by return max duration", () => {
    const result = filterFlightsByTime(flights, undefined, undefined, {
      returnMaxDurationHours: 5,
    });
    expect(result).toHaveLength(2);
    expect(result[0].returnLeg!.totalDuration).toBe(150);
    expect(result[1].returnLeg!.totalDuration).toBe(180);
  });

  it("filters by both outbound and return max duration", () => {
    const result = filterFlightsByTime(flights, undefined, undefined, {
      outboundMaxDurationHours: 10,
      returnMaxDurationHours: 3,
    });
    expect(result).toHaveLength(1);
    expect(result[0].outbound.totalDuration).toBe(120);
  });

  it("does not filter when duration filter is undefined", () => {
    const result = filterFlightsByTime(flights, undefined, undefined, undefined);
    expect(result).toHaveLength(3);
  });

  it("combines time range and duration filters", () => {
    const result = filterFlightsByTime(
      flights,
      { from: "09:00", to: "11:00" },
      undefined,
      { outboundMaxDurationHours: 10 }
    );
    expect(result).toHaveLength(2);
  });
});
