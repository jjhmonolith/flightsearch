import { describe, it, expect } from "vitest";
import { calculateLegs } from "./leg-calculator";

describe("calculateLegs", () => {
  it("generates 2 legs for simple round trip (no stopovers)", () => {
    const legs = calculateLegs("ICN", "NRT", "2026-05-01", "2026-05-08", [], []);
    expect(legs).toHaveLength(2);
    expect(legs[0]).toEqual({
      from: "ICN",
      to: "NRT",
      date: "2026-05-01",
      label: "구간 1: ICN → NRT",
    });
    expect(legs[1]).toEqual({
      from: "NRT",
      to: "ICN",
      date: "2026-05-08",
      label: "구간 2: NRT → ICN",
    });
  });

  it("generates correct legs with outbound stopover", () => {
    const legs = calculateLegs(
      "ICN",
      "NRT",
      "2026-05-01",
      "2026-05-10",
      [{ city: "BKK", stayDays: 3 }],
      []
    );
    expect(legs).toHaveLength(3);
    expect(legs[0].from).toBe("ICN");
    expect(legs[0].to).toBe("BKK");
    expect(legs[0].date).toBe("2026-05-01");
    expect(legs[1].from).toBe("BKK");
    expect(legs[1].to).toBe("NRT");
    expect(legs[1].date).toBe("2026-05-04"); // May 1 + 3 days
    expect(legs[2].from).toBe("NRT");
    expect(legs[2].to).toBe("ICN");
    expect(legs[2].date).toBe("2026-05-10");
  });

  it("generates correct legs with return stopover", () => {
    const legs = calculateLegs(
      "ICN",
      "NRT",
      "2026-05-01",
      "2026-05-08",
      [],
      [{ city: "SIN", stayDays: 2 }]
    );
    expect(legs).toHaveLength(3);
    expect(legs[0].from).toBe("ICN");
    expect(legs[0].to).toBe("NRT");
    expect(legs[1].from).toBe("NRT");
    expect(legs[1].to).toBe("SIN");
    expect(legs[1].date).toBe("2026-05-08");
    expect(legs[2].from).toBe("SIN");
    expect(legs[2].to).toBe("ICN");
    expect(legs[2].date).toBe("2026-05-10"); // May 8 + 2 days
  });

  it("handles both outbound and return stopovers", () => {
    const legs = calculateLegs(
      "ICN",
      "NRT",
      "2026-05-01",
      "2026-05-10",
      [{ city: "BKK", stayDays: 3 }],
      [{ city: "SIN", stayDays: 2 }]
    );
    expect(legs).toHaveLength(4);
    expect(legs.map((l) => `${l.from}→${l.to}`)).toEqual([
      "ICN→BKK",
      "BKK→NRT",
      "NRT→SIN",
      "SIN→ICN",
    ]);
    expect(legs.map((l) => l.date)).toEqual([
      "2026-05-01",
      "2026-05-04",
      "2026-05-10",
      "2026-05-12",
    ]);
  });

  it("handles multiple stopovers on outbound", () => {
    const legs = calculateLegs(
      "ICN",
      "CDG",
      "2026-06-01",
      "2026-06-20",
      [
        { city: "BKK", stayDays: 3 },
        { city: "DXB", stayDays: 2 },
      ],
      []
    );
    expect(legs).toHaveLength(4);
    expect(legs.map((l) => `${l.from}→${l.to}`)).toEqual([
      "ICN→BKK",
      "BKK→DXB",
      "DXB→CDG",
      "CDG→ICN",
    ]);
    expect(legs[1].date).toBe("2026-06-04"); // Jun 1 + 3
    expect(legs[2].date).toBe("2026-06-06"); // Jun 4 + 2
  });

  it("includes stay days info in labels", () => {
    const legs = calculateLegs(
      "ICN",
      "NRT",
      "2026-05-01",
      "2026-05-10",
      [{ city: "BKK", stayDays: 3 }],
      []
    );
    expect(legs[0].label).toContain("3일 체류");
  });
});
