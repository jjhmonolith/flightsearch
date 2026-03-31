import type { FlightSourceAdapter } from "@/adapters/types";
import type { SearchRequest } from "@/models/search-request";
import type {
  SearchResponse,
  SearchError,
  LegResult,
} from "@/models/search-response";
import type { Flight } from "@/models/flight";
import { deduplicateFlights } from "./flight-deduplicator";
import { sortFlights } from "./flight-sorter";
import { filterFlightsByTime } from "./flight-time-filter";
import { calculateLegs } from "@/lib/leg-calculator";
import type { LegDefinition } from "@/lib/leg-calculator";

async function searchSingleLeg(
  leg: LegDefinition,
  adapters: readonly FlightSourceAdapter[],
  request: SearchRequest
): Promise<{ flights: Flight[]; errors: SearchError[] }> {
  const searchPromises = adapters.map(async (adapter) => {
    try {
      const results = await adapter.search({
        departureCity: leg.from,
        destinationCity: leg.to,
        departureDate: leg.date,
        passengers: request.passengers,
        cabinClass: request.cabinClass,
        currency: request.currency,
      });
      // Tag each flight with the leg label and strip returnLeg
      const taggedFlights = results.map((f) => ({
        ...f,
        returnLeg: undefined,
        legLabel: leg.label,
      }));
      return {
        status: "ok" as const,
        flights: taggedFlights as Flight[],
        source: adapter.name,
      };
    } catch (error) {
      const message =
        error instanceof Error ? error.message : "Unknown error";
      return { status: "error" as const, source: adapter.name, message };
    }
  });

  const results = await Promise.allSettled(searchPromises);
  const flights: Flight[] = [];
  const errors: SearchError[] = [];

  for (const result of results) {
    if (result.status === "fulfilled") {
      if (result.value.status === "ok") {
        flights.push(...result.value.flights);
      } else {
        errors.push({
          source: result.value.source,
          message: result.value.message,
        });
      }
    } else {
      errors.push({
        source: "unknown",
        message: result.reason?.message ?? "Promise rejected",
      });
    }
  }

  return { flights, errors };
}

export async function searchFlights(
  request: SearchRequest,
  adapters: readonly FlightSourceAdapter[]
): Promise<SearchResponse> {
  const availableAdapters = adapters.filter((a) => a.isAvailable());

  if (availableAdapters.length === 0) {
    return {
      flights: [],
      errors: [
        {
          source: "system",
          message: "No flight search adapters are available",
        },
      ],
      searchedAt: new Date().toISOString(),
      cached: false,
      isMultiLeg: false,
    };
  }

  const hasStopovers =
    (request.outboundStopovers?.length ?? 0) > 0 ||
    (request.returnStopovers?.length ?? 0) > 0;

  // --- Multi-leg (stopover) mode ---
  if (hasStopovers) {
    return searchMultiLeg(request, availableAdapters);
  }

  // --- Standard round-trip mode ---
  return searchRoundTrip(request, availableAdapters);
}

async function searchRoundTrip(
  request: SearchRequest,
  adapters: readonly FlightSourceAdapter[]
): Promise<SearchResponse> {
  const searchPromises = request.destinationCities.flatMap((destination) =>
    adapters.map(async (adapter) => {
      try {
        const results = await adapter.search({
          departureCity: request.departureCity,
          destinationCity: destination,
          departureDate: request.departureDate,
          returnDate: request.returnDate,
          returnCity: request.returnCity,
          passengers: request.passengers,
          cabinClass: request.cabinClass,
          currency: request.currency,
        });
        return {
          status: "ok" as const,
          flights: results,
          source: adapter.name,
        };
      } catch (error) {
        const message =
          error instanceof Error ? error.message : "Unknown error";
        return { status: "error" as const, source: adapter.name, message };
      }
    })
  );

  const results = await Promise.allSettled(searchPromises);

  const allFlights: Flight[] = [];
  const errors: SearchError[] = [];

  for (const result of results) {
    if (result.status === "fulfilled") {
      const value = result.value;
      if (value.status === "ok") {
        allFlights.push(...value.flights);
      } else {
        errors.push({ source: value.source, message: value.message });
      }
    } else {
      errors.push({
        source: "unknown",
        message: result.reason?.message ?? "Promise rejected",
      });
    }
  }

  const deduplicated = deduplicateFlights(allFlights);
  const filtered = filterFlightsByTime(
    deduplicated,
    request.departureTimeRange,
    request.returnTimeRange,
    {
      outboundMaxDurationHours: request.outboundMaxDurationHours,
      returnMaxDurationHours: request.returnMaxDurationHours,
    }
  );
  const sorted = sortFlights(filtered, "price", "asc");

  return {
    flights: sorted as Flight[],
    errors,
    searchedAt: new Date().toISOString(),
    cached: false,
    isMultiLeg: false,
  };
}

async function searchMultiLeg(
  request: SearchRequest,
  adapters: readonly FlightSourceAdapter[]
): Promise<SearchResponse> {
  // For multi-destination stopovers, search each destination separately
  const allLegResults: LegResult[] = [];
  const allErrors: SearchError[] = [];

  for (const destination of request.destinationCities) {
    const legs = calculateLegs(
      request.departureCity,
      destination,
      request.departureDate,
      request.returnDate,
      request.outboundStopovers,
      request.returnStopovers,
      request.returnCity
    );

    // outbound legs = stopovers + 1 final leg to destination
    const outboundLegCount = (request.outboundStopovers?.length ?? 0) + 1;

    // Search all legs in parallel
    const legPromises = legs.map((leg) =>
      searchSingleLeg(leg, adapters, request)
    );
    const legResults = await Promise.all(legPromises);

    for (let i = 0; i < legs.length; i++) {
      const leg = legs[i];
      const result = legResults[i];
      const deduplicated = deduplicateFlights(result.flights);
      const maxHours = i < outboundLegCount
        ? request.outboundMaxDurationHours
        : request.returnMaxDurationHours;
      const durationFiltered = maxHours !== undefined
        ? deduplicated.filter((f) => f.outbound.totalDuration <= maxHours * 60)
        : deduplicated;
      const sorted = sortFlights(durationFiltered, "price", "asc");

      allLegResults.push({
        label: leg.label,
        from: leg.from,
        to: leg.to,
        date: leg.date,
        flights: sorted as Flight[],
      });
      allErrors.push(...result.errors);
    }
  }

  return {
    flights: [],
    legResults: allLegResults,
    errors: allErrors,
    searchedAt: new Date().toISOString(),
    cached: false,
    isMultiLeg: true,
  };
}
