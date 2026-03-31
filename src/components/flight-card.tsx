import type { Flight } from "@/models/flight";
import { formatPrice } from "@/lib/format";
import FlightLegDisplay from "./flight-leg-display";

interface FlightCardProps {
  readonly flight: Flight;
  readonly compact?: boolean;
}

const SOURCE_LABELS: Record<string, string> = {
  serpapi: "Google Flights",
  duffel: "Duffel",
};

export default function FlightCard({ flight, compact }: FlightCardProps) {
  const lowestPrice = Math.min(...flight.prices.map((p) => p.amount));
  const currency = flight.prices[0].currency;

  return (
    <div className="rounded-xl border border-gray-200 bg-white p-6 shadow-sm transition-shadow hover:shadow-md">
      <div className="flex flex-col gap-4 lg:flex-row lg:items-center lg:justify-between">
        <div className="flex-1 space-y-4">
          <FlightLegDisplay
            leg={flight.outbound}
            label={flight.returnLeg ? "가는 편" : ""}
          />
          {flight.returnLeg && (
            <FlightLegDisplay leg={flight.returnLeg} label="오는 편" />
          )}
        </div>

        <div
          className={`flex flex-col items-end gap-2 border-t pt-4 lg:border-t-0 lg:border-l lg:pt-0 lg:pl-6 ${
            compact ? "lg:min-w-[140px]" : ""
          }`}
        >
          <div className="text-2xl font-bold text-blue-700">
            {formatPrice(lowestPrice, currency)}
          </div>
          <div className="space-y-1">
            {flight.prices.map((price) => (
              <a
                key={price.source}
                href={price.bookingUrl}
                target="_blank"
                rel="noopener noreferrer"
                className="block rounded-lg bg-blue-600 px-4 py-2 text-center text-sm font-medium text-white transition-colors hover:bg-blue-700"
              >
                {SOURCE_LABELS[price.source] ?? price.source}{" "}
                {formatPrice(price.amount, price.currency)}
              </a>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}
