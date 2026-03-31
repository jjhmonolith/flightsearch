import { describe, it, expect } from "vitest";
import { SearchRequestSchema } from "./search-request";

describe("SearchRequestSchema", () => {
  const validRequest = {
    departureCity: "ICN",
    destinationCities: ["NRT"],
    departureDate: "2026-05-01",
    returnDate: "2026-05-08",
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
      departureDate: "2026-05-01",
      returnDate: "2026-05-08",
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

  it("rejects invalid date format", () => {
    const result = SearchRequestSchema.safeParse({
      ...validRequest,
      departureDate: "05/01/2026",
    });
    expect(result.success).toBe(false);
  });

  it("rejects return date before departure date", () => {
    const result = SearchRequestSchema.safeParse({
      ...validRequest,
      departureDate: "2026-05-08",
      returnDate: "2026-05-01",
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
