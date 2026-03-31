import type { Stopover } from "@/models/search-request";

export interface LegDefinition {
  readonly from: string;
  readonly to: string;
  readonly date: string;
  readonly label: string;
}

function addHours(dateStr: string, hours: number): string {
  const date = new Date(dateStr + "T00:00:00Z");
  date.setUTCHours(date.getUTCHours() + hours);
  return date.toISOString().split("T")[0];
}

/**
 * Calculate all flight legs from departure, stopovers, and return info.
 * Uses the minimum stay hours to determine the earliest next leg date.
 *
 * Example with outbound stopover in BKK (48-72h) and return stopover in SIN (24-48h):
 *   ICN → BKK (May 1)
 *   BKK → NRT (May 3)  -- 48h minimum
 *   NRT → SIN (May 9)
 *   SIN → ICN (May 10)  -- 24h minimum
 */
export function calculateLegs(
  departureCity: string,
  destinationCity: string,
  departureDate: string,
  returnDate: string,
  outboundStopovers: readonly Stopover[],
  returnStopovers: readonly Stopover[]
): readonly LegDefinition[] {
  const legs: LegDefinition[] = [];
  let legIndex = 1;

  // --- Outbound legs ---
  let currentCity = departureCity;
  let currentDate = departureDate;

  for (const stopover of outboundStopovers) {
    legs.push({
      from: currentCity,
      to: stopover.city,
      date: currentDate,
      label: `구간 ${legIndex}: ${currentCity} → ${stopover.city} (${stopover.stayHoursMin}-${stopover.stayHoursMax}시간 체류)`,
    });
    currentDate = addHours(currentDate, stopover.stayHoursMin);
    currentCity = stopover.city;
    legIndex++;
  }

  // Final outbound leg to destination
  legs.push({
    from: currentCity,
    to: destinationCity,
    date: currentDate,
    label: `구간 ${legIndex}: ${currentCity} → ${destinationCity}`,
  });
  legIndex++;

  // --- Return legs ---
  currentCity = destinationCity;
  currentDate = returnDate;

  for (const stopover of returnStopovers) {
    legs.push({
      from: currentCity,
      to: stopover.city,
      date: currentDate,
      label: `구간 ${legIndex}: ${currentCity} → ${stopover.city} (${stopover.stayHoursMin}-${stopover.stayHoursMax}시간 체류)`,
    });
    currentDate = addHours(currentDate, stopover.stayHoursMin);
    currentCity = stopover.city;
    legIndex++;
  }

  // Final return leg back to departure city
  legs.push({
    from: currentCity,
    to: departureCity,
    date: currentDate,
    label: `구간 ${legIndex}: ${currentCity} → ${departureCity}`,
  });

  return legs;
}
