"use client";

import type { LegResult } from "@/models/search-response";
import FlightCard from "./flight-card";
import { formatPrice } from "@/lib/format";

interface MultiLegResultsProps {
  readonly legResults: readonly LegResult[];
}

export default function MultiLegResults({ legResults }: MultiLegResultsProps) {
  return (
    <div className="space-y-8">
      <div className="rounded-lg border border-blue-200 bg-blue-50 p-4">
        <div className="text-sm font-medium text-blue-800">
          스톱오버 여정 — 각 구간별로 항공편을 확인하세요
        </div>
        <div className="mt-1 text-xs text-blue-600">
          각 구간을 개별 예약하시면 경유지에서 원하는 만큼 체류할 수 있습니다
        </div>
      </div>

      {legResults.map((legResult, index) => {
        const lowestPrice =
          legResult.flights.length > 0
            ? Math.min(
                ...legResult.flights.map((f) =>
                  Math.min(...f.prices.map((p) => p.amount))
                )
              )
            : 0;

        return (
          <div key={index} className="space-y-3">
            <div className="flex items-center justify-between border-b border-gray-200 pb-2">
              <div>
                <h3 className="text-lg font-semibold text-gray-900">
                  {legResult.label}
                </h3>
                <div className="text-sm text-gray-500">{legResult.date}</div>
              </div>
              {lowestPrice > 0 && (
                <div className="text-sm text-gray-600">
                  최저{" "}
                  <span className="font-bold text-blue-700">
                    {formatPrice(
                      lowestPrice,
                      legResult.flights[0]?.prices[0]?.currency ?? "KRW"
                    )}
                  </span>
                </div>
              )}
            </div>

            {legResult.flights.length > 0 ? (
              <div className="space-y-3">
                {legResult.flights.slice(0, 5).map((flight) => (
                  <FlightCard key={flight.id} flight={flight} compact />
                ))}
                {legResult.flights.length > 5 && (
                  <div className="text-center text-sm text-gray-500">
                    + {legResult.flights.length - 5}개 항공편 더 있음
                  </div>
                )}
              </div>
            ) : (
              <div className="py-6 text-center text-sm text-gray-400">
                이 구간에 대한 검색 결과가 없습니다
              </div>
            )}
          </div>
        );
      })}
    </div>
  );
}
