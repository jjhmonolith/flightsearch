import type { Stopover } from "@/models/search-request";

export interface LegDefinition {
  readonly from: string;
  readonly to: string;
  readonly date: string;
  readonly label: string;
}

function addDays(dateStr: string, days: number): string {
  const date = new Date(dateStr + "T00:00:00Z");
  date.setUTCDate(date.getUTCDate() + days);
  return date.toISOString().split("T")[0];
}

/**
 * Calculate all flight legs from departure, stopovers, and return info.
 *
 * Example with outbound stopover in BKK (3 days) and return stopover in SIN (2 days):
 *   ICN → BKK (May 1)
 *   BKK → NRT (May 4)
 *   NRT → SIN (May 9)
 *   SIN → ICN (May 11)
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
      label: `구간 ${legIndex}: ${currentCity} → ${stopover.city} (${stopover.stayDays}일 체류)`,
    });
    currentDate = addDays(currentDate, stopover.stayDays);
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
      label: `구간 ${legIndex}: ${currentCity} → ${stopover.city} (${stopover.stayDays}일 체류)`,
    });
    currentDate = addDays(currentDate, stopover.stayDays);
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
