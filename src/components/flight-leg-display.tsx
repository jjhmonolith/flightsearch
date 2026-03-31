import type { FlightLeg } from "@/models/flight";
import { formatDuration, formatTime, formatDate } from "@/lib/format";

interface FlightLegDisplayProps {
  readonly leg: FlightLeg;
  readonly label: string;
}

export default function FlightLegDisplay({
  leg,
  label,
}: FlightLegDisplayProps) {
  const firstSegment = leg.segments[0];
  const lastSegment = leg.segments[leg.segments.length - 1];

  return (
    <div className="space-y-1">
      <div className="text-xs font-medium text-gray-500 uppercase">{label}</div>
      <div className="flex items-center gap-3">
        <div className="text-center">
          <div className="text-lg font-bold">
            {formatTime(firstSegment.departureTime)}
          </div>
          <div className="text-xs text-gray-500">
            {firstSegment.departureAirport}
          </div>
          <div className="text-xs text-gray-400">
            {formatDate(firstSegment.departureTime)}
          </div>
        </div>

        <div className="flex flex-1 flex-col items-center">
          <div className="text-xs text-gray-500">
            {formatDuration(leg.totalDuration)}
          </div>
          <div className="relative flex w-full items-center">
            <div className="h-px flex-1 bg-gray-300" />
            {leg.stops > 0 && (
              <div className="px-1 text-xs text-orange-600">
                경유 {leg.stops}회
              </div>
            )}
            {leg.stops === 0 && (
              <div className="px-1 text-xs text-green-600">직항</div>
            )}
            <div className="h-px flex-1 bg-gray-300" />
          </div>
          <div className="text-xs text-gray-400">
            {leg.segments.map((s) => s.airline).join(", ")}
          </div>
        </div>

        <div className="text-center">
          <div className="text-lg font-bold">
            {formatTime(lastSegment.arrivalTime)}
          </div>
          <div className="text-xs text-gray-500">
            {lastSegment.arrivalAirport}
          </div>
          <div className="text-xs text-gray-400">
            {formatDate(lastSegment.arrivalTime)}
          </div>
        </div>
      </div>
    </div>
  );
}
