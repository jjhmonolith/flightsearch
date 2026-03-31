import { describe, it, expect } from "vitest";
import { sortFlights } from "./flight-sorter";
import type { Flight } from "@/models/flight";

function makeFlight(overrides: {
  price: number;
  outboundDuration: number;
  outboundStops: number;
}): Flight {
  return {
    id: `flight-${overrides.price}`,
    outbound: {
      segments: [
        {
          departureAirport: "ICN",
          arrivalAirport: "NRT",
          departureTime: "2026-05-01T09:00:00.000Z",
          arrivalTime: "2026-05-01T11:30:00.000Z",
          airline: "KE",
          flightNumber: "KE701",
          duration: overrides.outboundDuration,
        },
      ],
      totalDuration: overrides.outboundDuration,
      stops: overrides.outboundStops,
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
        amount: overrides.price,
        currency: "KRW",
        source: "serpapi",
        bookingUrl: "https://serpapi.com/book",
        bookingType: "redirect",
      },
    ],
  };
}

describe("sortFlights", () => {
  const flights = [
    makeFlight({ price: 300000, outboundDuration: 150, outboundStops: 0 }),
    makeFlight({ price: 195000, outboundDuration: 300, outboundStops: 1 }),
    makeFlight({ price: 250000, outboundDuration: 120, outboundStops: 0 }),
  ];

  it("sorts by price ascending by default", () => {
    const sorted = sortFlights(flights);
    const prices = sorted.map((f) => f.prices[0].amount);
    expect(prices).toEqual([195000, 250000, 300000]);
  });

  it("sorts by price descending", () => {
    const sorted = sortFlights(flights, "price", "desc");
    const prices = sorted.map((f) => f.prices[0].amount);
    expect(prices).toEqual([300000, 250000, 195000]);
  });

  it("sorts by duration ascending", () => {
    const sorted = sortFlights(flights, "duration", "asc");
    const durations = sorted.map(
      (f) => f.outbound.totalDuration + f.returnLeg.totalDuration
    );
    expect(durations).toEqual([300, 330, 480]);
  });

  it("sorts by stops ascending", () => {
    const sorted = sortFlights(flights, "stops", "asc");
    const stops = sorted.map(
      (f) => f.outbound.stops + f.returnLeg.stops
    );
    expect(stops[stops.length - 1]).toBe(1);
  });

  it("does not mutate the original array", () => {
    const original = [...flights];
    sortFlights(flights, "price", "desc");
    expect(flights.map((f) => f.prices[0].amount)).toEqual(
      original.map((f) => f.prices[0].amount)
    );
  });
});
