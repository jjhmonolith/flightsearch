import { describe, it, expect } from "vitest";
import { searchAirports } from "./airports";

describe("searchAirports", () => {
  it("finds airport by exact code", () => {
    const results = searchAirports("ICN");
    expect(results[0].code).toBe("ICN");
  });

  it("finds airport by code prefix", () => {
    const results = searchAirports("NR");
    expect(results.some((r) => r.code === "NRT")).toBe(true);
  });

  it("finds airports by city name", () => {
    const results = searchAirports("Tokyo");
    expect(results.length).toBeGreaterThanOrEqual(2);
    expect(results.some((r) => r.code === "NRT")).toBe(true);
    expect(results.some((r) => r.code === "HND")).toBe(true);
  });

  it("finds airports by country name in Korean", () => {
    const results = searchAirports("태국");
    expect(results.some((r) => r.code === "BKK")).toBe(true);
  });

  it("is case insensitive", () => {
    const results = searchAirports("icn");
    expect(results[0].code).toBe("ICN");
  });

  it("returns empty for empty query", () => {
    expect(searchAirports("")).toEqual([]);
  });

  it("limits results", () => {
    const results = searchAirports("a", 3);
    expect(results.length).toBeLessThanOrEqual(3);
  });

  it("prioritizes exact code over text matches", () => {
    const results = searchAirports("ICN");
    expect(results[0].code).toBe("ICN");
  });
});
