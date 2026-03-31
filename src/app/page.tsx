"use client";

import { useState, useMemo } from "react";
import SearchForm from "@/components/search-form";
import type { SearchFormData } from "@/components/search-form";
import FlightCard from "@/components/flight-card";
import SortControls from "@/components/sort-controls";
import ErrorBanner from "@/components/error-banner";
import MultiLegResults from "@/components/multi-leg-results";
import type { Flight } from "@/models/flight";
import type { SearchError, LegResult } from "@/models/search-response";
import type { SortField, SortDirection } from "@/services/flight-sorter";

function sortFlightsClient(
  flights: readonly Flight[],
  field: SortField,
  direction: SortDirection
): readonly Flight[] {
  const multiplier = direction === "asc" ? 1 : -1;

  const extractors: Record<SortField, (f: Flight) => number> = {
    price: (f) => Math.min(...f.prices.map((p) => p.amount)),
    duration: (f) =>
      f.outbound.totalDuration + (f.returnLeg?.totalDuration ?? 0),
    stops: (f) => f.outbound.stops + (f.returnLeg?.stops ?? 0),
  };

  return [...flights].sort(
    (a, b) => (extractors[field](a) - extractors[field](b)) * multiplier
  );
}

export default function HomePage() {
  const [flights, setFlights] = useState<readonly Flight[]>([]);
  const [legResults, setLegResults] = useState<readonly LegResult[]>([]);
  const [isMultiLeg, setIsMultiLeg] = useState(false);
  const [errors, setErrors] = useState<readonly SearchError[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [hasSearched, setHasSearched] = useState(false);
  const [sortField, setSortField] = useState<SortField>("price");
  const [sortDirection, setSortDirection] = useState<SortDirection>("asc");

  const sortedFlights = useMemo(
    () => sortFlightsClient(flights, sortField, sortDirection),
    [flights, sortField, sortDirection]
  );

  async function handleSearch(params: SearchFormData) {
    setIsLoading(true);
    setErrors([]);

    try {
      const response = await fetch("/api/search", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(params),
      });

      if (!response.ok) {
        const errorData = await response.json().catch(() => ({}));
        setErrors([
          {
            source: "client",
            message: errorData.error ?? `HTTP ${response.status}`,
          },
        ]);
        setFlights([]);
        setLegResults([]);
        return;
      }

      const data = await response.json();
      setIsMultiLeg(data.isMultiLeg ?? false);
      setFlights(data.flights ?? []);
      setLegResults(data.legResults ?? []);
      setErrors(data.errors ?? []);
    } catch (error) {
      setErrors([
        {
          source: "client",
          message:
            error instanceof Error
              ? error.message
              : "네트워크 오류가 발생했습니다",
        },
      ]);
      setFlights([]);
      setLegResults([]);
    } finally {
      setIsLoading(false);
      setHasSearched(true);
    }
  }

  function handleSortChange(field: SortField, direction: SortDirection) {
    setSortField(field);
    setSortDirection(direction);
  }

  return (
    <main className="mx-auto max-w-4xl px-4 py-8">
      <h1 className="mb-8 text-center text-3xl font-bold text-gray-900">
        항공권 검색
      </h1>

      <div className="mb-8 rounded-xl bg-white p-6 shadow-sm">
        <SearchForm onSearch={handleSearch} isLoading={isLoading} />
      </div>

      <ErrorBanner errors={errors} />

      {hasSearched && !isLoading && (
        <div className="mt-6 space-y-4">
          {/* Multi-leg (stopover) results */}
          {isMultiLeg && legResults.length > 0 && (
            <MultiLegResults legResults={legResults} />
          )}

          {/* Standard round-trip results */}
          {!isMultiLeg && flights.length > 0 && (
            <>
              <div className="flex items-center justify-between">
                <div className="text-sm text-gray-600">
                  {flights.length}개의 항공편을 찾았습니다
                </div>
                <SortControls
                  sortField={sortField}
                  sortDirection={sortDirection}
                  onSortChange={handleSortChange}
                />
              </div>

              {sortedFlights.map((flight) => (
                <FlightCard key={flight.id} flight={flight} />
              ))}
            </>
          )}

          {!isMultiLeg &&
            flights.length === 0 &&
            legResults.length === 0 &&
            errors.length === 0 && (
              <div className="py-12 text-center text-gray-500">
                검색 조건에 맞는 항공편이 없습니다
              </div>
            )}
        </div>
      )}
    </main>
  );
}
