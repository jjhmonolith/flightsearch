import type { Flight, FlightLeg, Segment, Price } from "@/models/flight";
import { generateFlightId } from "@/lib/flight-id";

interface DuffelSegment {
  readonly departing_at: string;
  readonly arriving_at: string;
  readonly operating_carrier: { readonly iata_code: string };
  readonly operating_carrier_flight_number: string;
  readonly duration: string;
  readonly origin: { readonly iata_code: string };
  readonly destination: { readonly iata_code: string };
}

interface DuffelSlice {
  readonly duration: string;
  readonly segments: readonly DuffelSegment[];
}

interface DuffelOffer {
  readonly id: string;
  readonly total_amount: string;
  readonly total_currency: string;
  readonly slices: readonly DuffelSlice[];
}

interface DuffelResponse {
  readonly data: {
    readonly offers: readonly DuffelOffer[];
  };
}

const DUFFEL_BOOKING_BASE = "https://app.duffel.com/book";

/**
 * Parse ISO 8601 duration (PT2H30M) to minutes.
 */
function parseDuration(iso: string): number {
  const match = iso.match(/PT(?:(\d+)H)?(?:(\d+)M)?/);
  if (!match) return 0;
  const hours = parseInt(match[1] ?? "0", 10);
  const minutes = parseInt(match[2] ?? "0", 10);
  return hours * 60 + minutes;
}

function toLocalDateTime(dateStr: string): string {
  // Duffel returns local times like "2026-05-01T09:00:00"
  return dateStr.replace(/Z$/, "");
}

function mapSegment(seg: DuffelSegment): Segment {
  const carrier = seg.operating_carrier.iata_code;
  return {
    departureAirport: seg.origin.iata_code,
    arrivalAirport: seg.destination.iata_code,
    departureTime: toLocalDateTime(seg.departing_at),
    arrivalTime: toLocalDateTime(seg.arriving_at),
    airline: carrier,
    flightNumber: `${carrier}${seg.operating_carrier_flight_number}`,
    duration: parseDuration(seg.duration),
  };
}

function mapSliceToLeg(slice: DuffelSlice): FlightLeg {
  const segments = slice.segments.map(mapSegment);
  return {
    segments,
    totalDuration: parseDuration(slice.duration),
    stops: segments.length - 1,
  };
}

function mapPrice(offer: DuffelOffer): Price {
  return {
    amount: parseFloat(offer.total_amount),
    currency: offer.total_currency,
    source: "duffel",
    bookingUrl: `${DUFFEL_BOOKING_BASE}/${offer.id}`,
    bookingType: "redirect",
  };
}

export function mapDuffelResponse(
  response: DuffelResponse
): readonly Flight[] {
  return response.data.offers
    .filter((offer) => offer.slices.length >= 1)
    .map((offer) => {
      const outbound = mapSliceToLeg(offer.slices[0]);
      const returnLeg =
        offer.slices.length >= 2
          ? mapSliceToLeg(offer.slices[1])
          : undefined;

      const id = returnLeg
        ? generateFlightId(outbound, returnLeg)
        : outbound.segments
            .map((s) => `${s.flightNumber}-${s.departureTime}`)
            .join("|");

      return {
        id,
        outbound,
        ...(returnLeg && { returnLeg }),
        prices: [mapPrice(offer)],
      };
    });
}
