import type { Flight } from "@/models/flight";
import type { TimeRange } from "@/models/search-request";
import { extractTimeHHMM } from "@/lib/format";

function isTimeInRange(dateTimeStr: string, range: TimeRange): boolean {
  const time = extractTimeHHMM(dateTimeStr);
  return time >= range.from && time <= range.to;
}

export function filterFlightsByTime(
  flights: readonly Flight[],
  departureTimeRange?: TimeRange,
  returnTimeRange?: TimeRange
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

    return true;
  });
}
