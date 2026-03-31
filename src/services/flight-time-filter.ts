import type { Flight } from "@/models/flight";
import type { TimeRange } from "@/models/search-request";
import { extractTimeHHMM } from "@/lib/format";

function isTimeInRange(dateTimeStr: string, range: TimeRange): boolean {
  const time = extractTimeHHMM(dateTimeStr);
  return time >= range.from && time <= range.to;
}

interface DurationFilter {
  readonly outboundMaxDurationHours?: number;
  readonly returnMaxDurationHours?: number;
}

export function filterFlightsByTime(
  flights: readonly Flight[],
  departureTimeRange?: TimeRange,
  returnTimeRange?: TimeRange,
  durationFilter?: DurationFilter
): readonly Flight[] {
  return flights.filter((flight) => {
    if (departureTimeRange) {
      const firstOutboundSegment = flight.outbound.segments[0];
      if (!isTimeInRange(firstOutboundSegment.departureTime, departureTimeRange)) {
        return false;
      }
    }

    if (returnTimeRange && flight.returnLeg) {
      const firstReturnSegment = flight.returnLeg.segments[0];
      if (!isTimeInRange(firstReturnSegment.departureTime, returnTimeRange)) {
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
