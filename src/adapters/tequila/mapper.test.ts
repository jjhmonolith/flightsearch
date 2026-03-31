import { describe, it, expect } from "vitest";
import { mapTequilaResponse } from "./mapper";
import { tequilaSearchFixture } from "./fixtures";
import { FlightSchema } from "@/models/flight";

describe("mapTequilaResponse", () => {
  const flights = mapTequilaResponse(tequilaSearchFixture);

  it("maps all flights from fixture", () => {
    expect(flights).toHaveLength(2);
  });

  it("produces valid Flight objects", () => {
    for (const flight of flights) {
      const result = FlightSchema.safeParse(flight);
      expect(result.success).toBe(true);
    }
  });

  it("maps direct flight correctly", () => {
    const direct = flights[0];
    expect(direct.outbound.segments).toHaveLength(1);
    expect(direct.outbound.stops).toBe(0);
    expect(direct.outbound.segments[0].departureAirport).toBe("ICN");
    expect(direct.outbound.segments[0].arrivalAirport).toBe("NRT");
    expect(direct.outbound.segments[0].airline).toBe("KE");
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
    expect(direct.prices[0].source).toBe("tequila");
    expect(direct.prices[0].bookingType).toBe("redirect");
    expect(direct.prices[0].bookingUrl).toContain("kiwi.com");
  });

  it("calculates duration in minutes", () => {
    const direct = flights[0];
    // 9000 seconds = 150 minutes
    expect(direct.outbound.totalDuration).toBe(150);
  });

  it("generates deterministic flight IDs", () => {
    const flights1 = mapTequilaResponse(tequilaSearchFixture);
    const flights2 = mapTequilaResponse(tequilaSearchFixture);
    expect(flights1[0].id).toBe(flights2[0].id);
  });
});
