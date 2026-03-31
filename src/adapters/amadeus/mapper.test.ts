import { describe, it, expect } from "vitest";
import { mapAmadeusResponse } from "./mapper";
import { amadeusSearchFixture } from "./fixtures";
import { FlightSchema } from "@/models/flight";

describe("mapAmadeusResponse", () => {
  const flights = mapAmadeusResponse(amadeusSearchFixture);

  it("maps all flights from fixture", () => {
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
    expect(connecting.outbound.segments[1].departureAirport).toBe("FUK");
  });

  it("maps return leg correctly", () => {
    const direct = flights[0];
    expect(direct.returnLeg.segments).toHaveLength(1);
    expect(direct.returnLeg.segments[0].departureAirport).toBe("NRT");
    expect(direct.returnLeg.segments[0].arrivalAirport).toBe("ICN");
  });

  it("maps price with correct source", () => {
    const direct = flights[0];
    expect(direct.prices).toHaveLength(1);
    expect(direct.prices[0].amount).toBe(285000);
    expect(direct.prices[0].currency).toBe("KRW");
    expect(direct.prices[0].source).toBe("amadeus");
    expect(direct.prices[0].bookingType).toBe("redirect");
  });

  it("parses ISO 8601 duration to minutes", () => {
    const direct = flights[0];
    // PT2H30M = 150 minutes
    expect(direct.outbound.totalDuration).toBe(150);
  });

  it("generates deterministic flight IDs", () => {
    const flights1 = mapAmadeusResponse(amadeusSearchFixture);
    const flights2 = mapAmadeusResponse(amadeusSearchFixture);
    expect(flights1[0].id).toBe(flights2[0].id);
  });

  it("handles empty data array", () => {
    const result = mapAmadeusResponse({ ...amadeusSearchFixture, data: [] });
    expect(result).toEqual([]);
  });
});
