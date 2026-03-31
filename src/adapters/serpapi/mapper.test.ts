import { describe, it, expect } from "vitest";
import { mapSerpApiFlights } from "./mapper";
import { serpApiSearchFixture, serpApiReturnFixture } from "./fixtures";
import { FlightSchema } from "@/models/flight";

describe("mapSerpApiFlights", () => {
  const flights = mapSerpApiFlights(
    serpApiSearchFixture,
    serpApiReturnFixture,
    "KRW"
  );

  it("maps all outbound flights paired with return", () => {
    expect(flights).toHaveLength(2);
  });

  it("produces valid Flight objects", () => {
    for (const flight of flights) {
      const result = FlightSchema.safeParse(flight);
      if (!result.success) {
        console.error(result.error.issues);
      }
      expect(result.success).toBe(true);
    }
  });

  it("maps direct flight outbound correctly", () => {
    const direct = flights[0];
    expect(direct.outbound.segments).toHaveLength(1);
    expect(direct.outbound.stops).toBe(0);
    expect(direct.outbound.segments[0].departureAirport).toBe("ICN");
    expect(direct.outbound.segments[0].arrivalAirport).toBe("NRT");
    expect(direct.outbound.segments[0].flightNumber).toBe("KE701");
  });

  it("maps connecting flight with correct stops", () => {
    const connecting = flights[1];
    expect(connecting.outbound.segments).toHaveLength(2);
    expect(connecting.outbound.stops).toBe(1);
    expect(connecting.outbound.segments[0].arrivalAirport).toBe("FUK");
  });

  it("maps return leg from return fixture", () => {
    const direct = flights[0];
    expect(direct.returnLeg.segments).toHaveLength(1);
    expect(direct.returnLeg.segments[0].departureAirport).toBe("NRT");
    expect(direct.returnLeg.segments[0].arrivalAirport).toBe("ICN");
  });

  it("maps price with serpapi source", () => {
    const direct = flights[0];
    expect(direct.prices[0].amount).toBe(285000);
    expect(direct.prices[0].currency).toBe("KRW");
    expect(direct.prices[0].source).toBe("serpapi");
    expect(direct.prices[0].bookingType).toBe("redirect");
    expect(direct.prices[0].bookingUrl).toContain("google.com/travel/flights");
  });

  it("calculates total duration correctly", () => {
    const direct = flights[0];
    expect(direct.outbound.totalDuration).toBe(150);
  });

  it("generates deterministic flight IDs", () => {
    const flights1 = mapSerpApiFlights(
      serpApiSearchFixture,
      serpApiReturnFixture,
      "KRW"
    );
    expect(flights[0].id).toBe(flights1[0].id);
  });

  it("handles empty best_flights and other_flights", () => {
    const empty = { ...serpApiSearchFixture, best_flights: [], other_flights: [] };
    const result = mapSerpApiFlights(empty, serpApiReturnFixture, "KRW");
    expect(result).toEqual([]);
  });
});
