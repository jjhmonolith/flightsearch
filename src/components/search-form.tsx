"use client";

import { useState } from "react";
import type { CabinClass } from "@/models/flight";
import AirportSearch from "./airport-search";
import TimeRangeInput from "./time-range-input";
import StopoverInput from "./stopover-input";
import type { StopoverData } from "./stopover-input";

interface TimeRange {
  readonly from: string;
  readonly to: string;
}

interface SearchFormProps {
  readonly onSearch: (params: SearchFormData) => void;
  readonly isLoading: boolean;
}

export interface SearchFormData {
  readonly departureCity: string;
  readonly returnCity?: string;
  readonly destinationCities: string[];
  readonly departureDate: string;
  readonly returnDate: string;
  readonly passengers: number;
  readonly cabinClass: CabinClass;
  readonly currency: string;
  readonly departureTimeRange?: TimeRange;
  readonly returnTimeRange?: TimeRange;
  readonly outboundStopovers: StopoverData[];
  readonly returnStopovers: StopoverData[];
}

const CABIN_OPTIONS: { value: CabinClass; label: string }[] = [
  { value: "economy", label: "이코노미" },
  { value: "premium_economy", label: "프리미엄 이코노미" },
  { value: "business", label: "비즈니스" },
  { value: "first", label: "퍼스트" },
];

export default function SearchForm({ onSearch, isLoading }: SearchFormProps) {
  const [departureCity, setDepartureCity] = useState("ICN");
  const [differentReturnCity, setDifferentReturnCity] = useState(false);
  const [returnCity, setReturnCity] = useState("");
  const [destinationInput, setDestinationInput] = useState("");
  const [destinations, setDestinations] = useState<string[]>([]);
  const [departureDate, setDepartureDate] = useState("");
  const [returnDate, setReturnDate] = useState("");
  const [passengers, setPassengers] = useState(1);
  const [cabinClass, setCabinClass] = useState<CabinClass>("economy");

  // Time range
  const [depTimeEnabled, setDepTimeEnabled] = useState(false);
  const [depTimeFrom, setDepTimeFrom] = useState("06:00");
  const [depTimeTo, setDepTimeTo] = useState("22:00");
  const [retTimeEnabled, setRetTimeEnabled] = useState(false);
  const [retTimeFrom, setRetTimeFrom] = useState("06:00");
  const [retTimeTo, setRetTimeTo] = useState("22:00");

  // Stopovers
  const [outboundStopovers, setOutboundStopovers] = useState<StopoverData[]>(
    []
  );
  const [returnStopovers, setReturnStopovers] = useState<StopoverData[]>([]);

  function handleAddDestination(code?: string) {
    const airportCode = (code ?? destinationInput).trim().toUpperCase();
    if (airportCode.length === 3 && !destinations.includes(airportCode)) {
      setDestinations([...destinations, airportCode]);
      setDestinationInput("");
    }
  }

  function handleRemoveDestination(code: string) {
    setDestinations(destinations.filter((d) => d !== code));
  }

  function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    if (destinations.length === 0) return;

    const validOutbound = outboundStopovers.filter(
      (s) => s.city.length === 3
    );
    const validReturn = returnStopovers.filter((s) => s.city.length === 3);

    const params: SearchFormData = {
      departureCity,
      ...(differentReturnCity && returnCity.length === 3 && { returnCity }),
      destinationCities: destinations,
      departureDate,
      returnDate,
      passengers,
      cabinClass,
      currency: "KRW",
      outboundStopovers: validOutbound,
      returnStopovers: validReturn,
      ...(depTimeEnabled && {
        departureTimeRange: { from: depTimeFrom, to: depTimeTo },
      }),
      ...(retTimeEnabled && {
        returnTimeRange: { from: retTimeFrom, to: retTimeTo },
      }),
    };

    onSearch(params);
  }

  const today = new Date().toISOString().split("T")[0];

  return (
    <form onSubmit={handleSubmit} className="space-y-6">
      {/* Departure & Destination */}
      <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
        <div>
          <AirportSearch
            id="departure"
            label="출발지"
            value={departureCity}
            onChange={setDepartureCity}
            placeholder="ICN"
          />
          <div className="mt-2">
            <label className="inline-flex items-center gap-2 text-sm text-gray-600">
              <input
                type="checkbox"
                checked={differentReturnCity}
                onChange={(e) => {
                  setDifferentReturnCity(e.target.checked);
                  if (!e.target.checked) setReturnCity("");
                }}
                className="rounded border-gray-300"
              />
              귀국 도착지 다르게 설정
            </label>
            {differentReturnCity && (
              <div className="mt-2">
                <AirportSearch
                  id="returnCity"
                  label="귀국 도착지"
                  value={returnCity}
                  onChange={setReturnCity}
                  placeholder="귀국 도착 공항"
                />
              </div>
            )}
          </div>
        </div>

        <div>
          <label
            htmlFor="destination"
            className="mb-1 block text-sm font-medium text-gray-700"
          >
            목적지
          </label>
          <div className="flex gap-2">
            <div className="flex-1">
              <AirportSearch
                id="destination"
                label=""
                value={destinationInput}
                onChange={(code) => {
                  setDestinationInput(code);
                  handleAddDestination(code);
                }}
                placeholder="도시, 공항 코드 검색"
              />
            </div>
            <button
              type="button"
              onClick={() => handleAddDestination()}
              className="mt-0 self-end rounded-lg bg-gray-200 px-4 py-2 text-sm font-medium hover:bg-gray-300"
            >
              추가
            </button>
          </div>
          {destinations.length > 0 && (
            <div className="mt-2 flex flex-wrap gap-2">
              {destinations.map((code) => (
                <span
                  key={code}
                  className="inline-flex items-center gap-1 rounded-full bg-blue-100 px-3 py-1 text-sm text-blue-800"
                >
                  {code}
                  <button
                    type="button"
                    onClick={() => handleRemoveDestination(code)}
                    className="ml-1 text-blue-600 hover:text-blue-900"
                    aria-label={`${code} 제거`}
                  >
                    x
                  </button>
                </span>
              ))}
            </div>
          )}
        </div>
      </div>

      {/* Date & Passengers */}
      <div className="grid grid-cols-1 gap-4 md:grid-cols-2 lg:grid-cols-4">
        <div>
          <label
            htmlFor="departureDate"
            className="mb-1 block text-sm font-medium text-gray-700"
          >
            출발일
          </label>
          <input
            id="departureDate"
            type="date"
            value={departureDate}
            onChange={(e) => setDepartureDate(e.target.value)}
            min={today}
            className="w-full rounded-lg border border-gray-300 px-4 py-2 focus:border-blue-500 focus:ring-2 focus:ring-blue-200 focus:outline-none"
            required
          />
        </div>

        <div>
          <label
            htmlFor="returnDate"
            className="mb-1 block text-sm font-medium text-gray-700"
          >
            귀국일 (현지 시간)
          </label>
          <input
            id="returnDate"
            type="date"
            value={returnDate}
            onChange={(e) => setReturnDate(e.target.value)}
            min={departureDate || today}
            className="w-full rounded-lg border border-gray-300 px-4 py-2 focus:border-blue-500 focus:ring-2 focus:ring-blue-200 focus:outline-none"
            required
          />
        </div>

        <div>
          <label
            htmlFor="passengers"
            className="mb-1 block text-sm font-medium text-gray-700"
          >
            승객 수
          </label>
          <select
            id="passengers"
            value={passengers}
            onChange={(e) => setPassengers(Number(e.target.value))}
            className="w-full rounded-lg border border-gray-300 px-4 py-2 focus:border-blue-500 focus:ring-2 focus:ring-blue-200 focus:outline-none"
          >
            {Array.from({ length: 9 }, (_, i) => i + 1).map((n) => (
              <option key={n} value={n}>
                {n}명
              </option>
            ))}
          </select>
        </div>

        <div>
          <label
            htmlFor="cabinClass"
            className="mb-1 block text-sm font-medium text-gray-700"
          >
            좌석 등급
          </label>
          <select
            id="cabinClass"
            value={cabinClass}
            onChange={(e) => setCabinClass(e.target.value as CabinClass)}
            className="w-full rounded-lg border border-gray-300 px-4 py-2 focus:border-blue-500 focus:ring-2 focus:ring-blue-200 focus:outline-none"
          >
            {CABIN_OPTIONS.map((opt) => (
              <option key={opt.value} value={opt.value}>
                {opt.label}
              </option>
            ))}
          </select>
        </div>
      </div>

      {/* Stopovers */}
      <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
        <StopoverInput
          label="가는 편 경유지"
          stopovers={outboundStopovers}
          onChange={setOutboundStopovers}
        />
        <StopoverInput
          label="오는 편 경유지"
          stopovers={returnStopovers}
          onChange={setReturnStopovers}
        />
      </div>

      {/* Time Range Filters */}
      <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
        <TimeRangeInput
          label="출발 시간대 설정"
          from={depTimeFrom}
          to={depTimeTo}
          enabled={depTimeEnabled}
          onEnabledChange={setDepTimeEnabled}
          onFromChange={setDepTimeFrom}
          onToChange={setDepTimeTo}
        />
        <TimeRangeInput
          label="귀국 시간대 설정 (현지 시간)"
          from={retTimeFrom}
          to={retTimeTo}
          enabled={retTimeEnabled}
          onEnabledChange={setRetTimeEnabled}
          onFromChange={setRetTimeFrom}
          onToChange={setRetTimeTo}
        />
      </div>

      <button
        type="submit"
        disabled={isLoading || destinations.length === 0}
        className="w-full rounded-lg bg-blue-600 px-6 py-3 text-lg font-semibold text-white transition-colors hover:bg-blue-700 disabled:cursor-not-allowed disabled:bg-gray-400"
      >
        {isLoading ? "검색 중..." : "항공권 검색"}
      </button>
    </form>
  );
}
