import { describe, it, expect } from "vitest";
import { SearchRequestSchema, getDatesInRange } from "./search-request";

describe("SearchRequestSchema", () => {
  const validRequest = {
    departureCity: "ICN",
    destinationCities: ["NRT"],
    departureRange: { from: "2026-05-01T09:00", to: "2026-05-01T22:00" },
    returnRange: { from: "2026-05-08T09:00", to: "2026-05-08T22:00" },
    passengers: 1,
    cabinClass: "economy" as const,
    currency: "KRW",
  };

  it("accepts a valid search request", () => {
    const result = SearchRequestSchema.safeParse(validRequest);
    expect(result.success).toBe(true);
  });

  it("accepts multiple destination cities", () => {
    const result = SearchRequestSchema.safeParse({
      ...validRequest,
      destinationCities: ["NRT", "KIX", "FUK"],
    });
    expect(result.success).toBe(true);
  });

  it("applies defaults for optional fields", () => {
    const result = SearchRequestSchema.safeParse({
      departureCity: "ICN",
      destinationCities: ["NRT"],
      departureRange: { from: "2026-05-01T09:00", to: "2026-05-01T22:00" },
      returnRange: { from: "2026-05-08T09:00", to: "2026-05-08T22:00" },
    });
    expect(result.success).toBe(true);
    if (result.success) {
      expect(result.data.passengers).toBe(1);
      expect(result.data.cabinClass).toBe("economy");
      expect(result.data.currency).toBe("KRW");
    }
  });

  it("rejects invalid airport code length", () => {
    const result = SearchRequestSchema.safeParse({
      ...validRequest,
      departureCity: "ICNN",
    });
    expect(result.success).toBe(false);
  });

  it("rejects empty destination cities", () => {
    const result = SearchRequestSchema.safeParse({
      ...validRequest,
      destinationCities: [],
    });
    expect(result.success).toBe(false);
  });

  it("rejects more than 10 destinations", () => {
    const result = SearchRequestSchema.safeParse({
      ...validRequest,
      destinationCities: Array(11).fill("NRT"),
    });
    expect(result.success).toBe(false);
  });

  it("rejects invalid datetime format", () => {
    const result = SearchRequestSchema.safeParse({
      ...validRequest,
      departureRange: { from: "2026-05-01", to: "2026-05-01T22:00" },
    });
    expect(result.success).toBe(false);
  });

  it("rejects return before departure", () => {
    const result = SearchRequestSchema.safeParse({
      ...validRequest,
      departureRange: { from: "2026-05-08T09:00", to: "2026-05-08T22:00" },
      returnRange: { from: "2026-05-01T09:00", to: "2026-05-01T22:00" },
    });
    expect(result.success).toBe(false);
  });

  it("rejects passengers greater than 9", () => {
    const result = SearchRequestSchema.safeParse({
      ...validRequest,
      passengers: 10,
    });
    expect(result.success).toBe(false);
  });

  it("rejects invalid cabin class", () => {
    const result = SearchRequestSchema.safeParse({
      ...validRequest,
      cabinClass: "luxury",
    });
    expect(result.success).toBe(false);
  });
});

describe("getDatesInRange", () => {
  it("returns single date for same-day range", () => {
    const dates = getDatesInRange({
      from: "2026-05-01T09:00",
      to: "2026-05-01T22:00",
    });
    expect(dates).toEqual(["2026-05-01"]);
  });

  it("returns multiple dates for multi-day range", () => {
    const dates = getDatesInRange({
      from: "2026-05-01T09:00",
      to: "2026-05-03T18:00",
    });
    expect(dates).toEqual(["2026-05-01", "2026-05-02", "2026-05-03"]);
  });

  it("caps at 5 dates", () => {
    const dates = getDatesInRange({
      from: "2026-05-01T00:00",
      to: "2026-05-10T23:59",
    });
    expect(dates).toHaveLength(5);
    expect(dates[0]).toBe("2026-05-01");
    expect(dates[4]).toBe("2026-05-05");
  });
});
