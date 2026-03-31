import type { Flight } from "@/models/flight";
import type { DateTimeRange } from "@/models/search-request";

function isDateTimeInRange(dateTimeStr: string, range: DateTimeRange): boolean {
  // Normalize to comparable format (strip seconds/timezone for local comparison)
  const normalized = dateTimeStr.replace(/:\d{2}\.\d{3}Z$/, "").replace(/:\d{2}$/, "").slice(0, 16);
  return normalized >= range.from && normalized <= range.to;
}

interface DurationFilter {
  readonly outboundMaxDurationHours?: number;
  readonly returnMaxDurationHours?: number;
}

export function filterFlightsByTime(
  flights: readonly Flight[],
  departureRange?: DateTimeRange,
  returnRange?: DateTimeRange,
  durationFilter?: DurationFilter
): readonly Flight[] {
  return flights.filter((flight) => {
    if (departureRange) {
      const firstOutboundSegment = flight.outbound.segments[0];
      if (!isDateTimeInRange(firstOutboundSegment.departureTime, departureRange)) {
        return false;
      }
    }

    if (returnRange && flight.returnLeg) {
      const firstReturnSegment = flight.returnLeg.segments[0];
      if (!isDateTimeInRange(firstReturnSegment.departureTime, returnRange)) {
        return false;
      }
    }

    if (durationFilter?.outboundMaxDurationHours !== undefined) {
      const maxMinutes = durationFilter.outboundMaxDurationHours * 60;
      if (flight.outbound.totalDuration > maxMinutes) {
        return false;
      }
    }

    if (durationFilter?.returnMaxDurationHours !== undefined && flight.returnLeg) {
      const maxMinutes = durationFilter.returnMaxDurationHours * 60;
      if (flight.returnLeg.totalDuration > maxMinutes) {
        return false;
      }
    }

    return true;
  });
}
