import type { Flight, FlightLeg, Segment, Price } from "@/models/flight";
import { generateFlightId } from "@/lib/flight-id";

interface AmadeusSegment {
  readonly departure: { readonly iataCode: string; readonly at: string };
  readonly arrival: { readonly iataCode: string; readonly at: string };
  readonly carrierCode: string;
  readonly number: string;
  readonly duration: string;
}

interface AmadeusItinerary {
  readonly duration: string;
  readonly segments: readonly AmadeusSegment[];
}

interface AmadeusOffer {
  readonly id: string;
  readonly itineraries: readonly AmadeusItinerary[];
  readonly price: {
    readonly currency: string;
    readonly grandTotal: string;
  };
}

interface AmadeusResponse {
  readonly data: readonly AmadeusOffer[];
}

const AMADEUS_SEARCH_URL = "https://www.amadeus.com/en/flights";

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
  // Amadeus returns local times like "2026-05-01T09:00:00"
  // Preserve as local time — strip any Z suffix
  return dateStr.replace(/Z$/, "");
}

function mapSegment(seg: AmadeusSegment): Segment {
  return {
    departureAirport: seg.departure.iataCode,
    arrivalAirport: seg.arrival.iataCode,
    departureTime: toLocalDateTime(seg.departure.at),
    arrivalTime: toLocalDateTime(seg.arrival.at),
    airline: seg.carrierCode,
    flightNumber: `${seg.carrierCode}${seg.number}`,
    duration: parseDuration(seg.duration),
  };
}

function mapItineraryToLeg(itinerary: AmadeusItinerary): FlightLeg {
  const segments = itinerary.segments.map(mapSegment);
  return {
    segments,
    totalDuration: parseDuration(itinerary.duration),
    stops: segments.length - 1,
  };
}

function buildBookingUrl(offer: AmadeusOffer): string {
  const outbound = offer.itineraries[0]?.segments[0];
  const ret = offer.itineraries[1]?.segments[0];
  if (!outbound || !ret) return AMADEUS_SEARCH_URL;

  const params = new URLSearchParams({
    origin: outbound.departure.iataCode,
    destination: outbound.arrival.iataCode,
    departureDate: outbound.departure.at.split("T")[0],
    returnDate: ret.departure.at.split("T")[0],
  });
  return `${AMADEUS_SEARCH_URL}?${params.toString()}`;
}

function mapPrice(offer: AmadeusOffer): Price {
  return {
    amount: parseFloat(offer.price.grandTotal),
    currency: offer.price.currency,
    source: "amadeus",
    bookingUrl: buildBookingUrl(offer),
    bookingType: "redirect",
  };
}

export function mapAmadeusResponse(
  response: AmadeusResponse
): readonly Flight[] {
  return response.data.map((offer) => {
    const outbound = mapItineraryToLeg(offer.itineraries[0]);
    const returnLeg = mapItineraryToLeg(offer.itineraries[1]);

    return {
      id: generateFlightId(outbound, returnLeg),
      outbound,
      returnLeg,
      prices: [mapPrice(offer)],
    };
  });
}
