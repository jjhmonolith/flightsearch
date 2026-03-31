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
      [{ city: "BKK", stayHoursMin: 72, stayHoursMax: 96 }],
      []
    );
    expect(legs).toHaveLength(3);
    expect(legs[0].from).toBe("ICN");
    expect(legs[0].to).toBe("BKK");
    expect(legs[0].date).toBe("2026-05-01");
    expect(legs[1].from).toBe("BKK");
    expect(legs[1].to).toBe("NRT");
    expect(legs[1].date).toBe("2026-05-04"); // May 1 + 72h = May 4
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
      [{ city: "SIN", stayHoursMin: 48, stayHoursMax: 72 }]
    );
    expect(legs).toHaveLength(3);
    expect(legs[0].from).toBe("ICN");
    expect(legs[0].to).toBe("NRT");
    expect(legs[1].from).toBe("NRT");
    expect(legs[1].to).toBe("SIN");
    expect(legs[1].date).toBe("2026-05-08");
    expect(legs[2].from).toBe("SIN");
    expect(legs[2].to).toBe("ICN");
    expect(legs[2].date).toBe("2026-05-10"); // May 8 + 48h = May 10
  });

  it("handles both outbound and return stopovers", () => {
    const legs = calculateLegs(
      "ICN",
      "NRT",
      "2026-05-01",
      "2026-05-10",
      [{ city: "BKK", stayHoursMin: 72, stayHoursMax: 96 }],
      [{ city: "SIN", stayHoursMin: 48, stayHoursMax: 72 }]
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
        { city: "BKK", stayHoursMin: 72, stayHoursMax: 96 },
        { city: "DXB", stayHoursMin: 48, stayHoursMax: 72 },
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
    expect(legs[1].date).toBe("2026-06-04"); // Jun 1 + 72h
    expect(legs[2].date).toBe("2026-06-06"); // Jun 4 + 48h
  });

  it("includes stay hours info in labels", () => {
    const legs = calculateLegs(
      "ICN",
      "NRT",
      "2026-05-01",
      "2026-05-10",
      [{ city: "BKK", stayHoursMin: 48, stayHoursMax: 72 }],
      []
    );
    expect(legs[0].label).toContain("48-72시간 체류");
  });

  it("handles sub-day hour increments correctly", () => {
    const legs = calculateLegs(
      "ICN",
      "NRT",
      "2026-05-01",
      "2026-05-10",
      [{ city: "BKK", stayHoursMin: 12, stayHoursMax: 24 }],
      []
    );
    expect(legs[1].date).toBe("2026-05-01"); // 12h stays on same day
  });

  it("uses returnCity when specified (open-jaw)", () => {
    const legs = calculateLegs("ICN", "NRT", "2026-05-01", "2026-05-08", [], [], "GMP");
    expect(legs).toHaveLength(2);
    expect(legs[0]).toEqual({
      from: "ICN",
      to: "NRT",
      date: "2026-05-01",
      label: "구간 1: ICN → NRT",
    });
    expect(legs[1]).toEqual({
      from: "NRT",
      to: "GMP",
      date: "2026-05-08",
      label: "구간 2: NRT → GMP",
    });
  });

  it("falls back to departureCity when returnCity is undefined", () => {
    const legs = calculateLegs("ICN", "NRT", "2026-05-01", "2026-05-08", [], [], undefined);
    expect(legs[1].to).toBe("ICN");
  });

  it("uses returnCity with return stopovers", () => {
    const legs = calculateLegs(
      "ICN",
      "NRT",
      "2026-05-01",
      "2026-05-08",
      [],
      [{ city: "SIN", stayHoursMin: 48, stayHoursMax: 72 }],
      "GMP"
    );
    expect(legs).toHaveLength(3);
    expect(legs[2].from).toBe("SIN");
    expect(legs[2].to).toBe("GMP");
  });
});
