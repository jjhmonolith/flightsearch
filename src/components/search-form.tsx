"use client";

import { useState } from "react";
import type { CabinClass } from "@/models/flight";
import AirportSearch from "./airport-search";
import StopoverInput from "./stopover-input";
import type { StopoverData } from "./stopover-input";

interface DateTimeRange {
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
  readonly departureRange: DateTimeRange;
  readonly returnRange: DateTimeRange;
  readonly passengers: number;
  readonly cabinClass: CabinClass;
  readonly currency: string;
  readonly outboundMaxDurationHours?: number;
  readonly returnMaxDurationHours?: number;
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

  // Departure datetime range
  const [depFrom, setDepFrom] = useState("");
  const [depTo, setDepTo] = useState("");

  // Return datetime range
  const [retFrom, setRetFrom] = useState("");
  const [retTo, setRetTo] = useState("");

  const [passengers, setPassengers] = useState(1);
  const [cabinClass, setCabinClass] = useState<CabinClass>("economy");

  // Duration filter
  const [durationFilterEnabled, setDurationFilterEnabled] = useState(false);
  const [outboundMaxHours, setOutboundMaxHours] = useState(24);
  const [returnMaxHours, setReturnMaxHours] = useState(24);

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
    if (!depFrom || !depTo || !retFrom || !retTo) return;

    const validOutbound = outboundStopovers.filter(
      (s) => s.city.length === 3
    );
    const validReturn = returnStopovers.filter((s) => s.city.length === 3);

    const params: SearchFormData = {
      departureCity,
      ...(differentReturnCity && returnCity.length === 3 && { returnCity }),
      destinationCities: destinations,
      departureRange: { from: depFrom, to: depTo },
      returnRange: { from: retFrom, to: retTo },
      passengers,
      cabinClass,
      currency: "KRW",
      outboundStopovers: validOutbound,
      returnStopovers: validReturn,
      ...(durationFilterEnabled && {
        outboundMaxDurationHours: outboundMaxHours,
        returnMaxDurationHours: returnMaxHours,
      }),
    };

    onSearch(params);
  }

  const nowLocal = new Date().toISOString().slice(0, 16);

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

      {/* Departure Datetime Range */}
      <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
        <div>
          <label className="mb-1 block text-sm font-medium text-gray-700">
            출발 가능 시작
          </label>
          <input
            type="datetime-local"
            value={depFrom}
            onChange={(e) => {
              setDepFrom(e.target.value);
              if (!depTo || e.target.value > depTo) setDepTo(e.target.value);
            }}
            min={nowLocal}
            className="w-full rounded-lg border border-gray-300 px-4 py-2 focus:border-blue-500 focus:ring-2 focus:ring-blue-200 focus:outline-none"
            required
          />
        </div>
        <div>
          <label className="mb-1 block text-sm font-medium text-gray-700">
            출발 가능 종료
          </label>
          <input
            type="datetime-local"
            value={depTo}
            onChange={(e) => setDepTo(e.target.value)}
            min={depFrom || nowLocal}
            className="w-full rounded-lg border border-gray-300 px-4 py-2 focus:border-blue-500 focus:ring-2 focus:ring-blue-200 focus:outline-none"
            required
          />
        </div>
      </div>

      {/* Return Datetime Range */}
      <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
        <div>
          <label className="mb-1 block text-sm font-medium text-gray-700">
            귀국 가능 시작 (현지 시간)
          </label>
          <input
            type="datetime-local"
            value={retFrom}
            onChange={(e) => {
              setRetFrom(e.target.value);
              if (!retTo || e.target.value > retTo) setRetTo(e.target.value);
            }}
            min={depFrom || nowLocal}
            className="w-full rounded-lg border border-gray-300 px-4 py-2 focus:border-blue-500 focus:ring-2 focus:ring-blue-200 focus:outline-none"
            required
          />
        </div>
        <div>
          <label className="mb-1 block text-sm font-medium text-gray-700">
            귀국 가능 종료 (현지 시간)
          </label>
          <input
            type="datetime-local"
            value={retTo}
            onChange={(e) => setRetTo(e.target.value)}
            min={retFrom || depFrom || nowLocal}
            className="w-full rounded-lg border border-gray-300 px-4 py-2 focus:border-blue-500 focus:ring-2 focus:ring-blue-200 focus:outline-none"
            required
          />
        </div>
      </div>

      {/* Passengers & Cabin */}
      <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
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

      {/* Duration Filter */}
      <div className="rounded-lg border border-gray-200 p-4">
        <label className="inline-flex items-center gap-2 text-sm font-medium text-gray-700">
          <input
            type="checkbox"
            checked={durationFilterEnabled}
            onChange={(e) => setDurationFilterEnabled(e.target.checked)}
            className="rounded border-gray-300"
          />
          최대 비행시간 설정
        </label>
        {durationFilterEnabled && (
          <div className="mt-3 grid grid-cols-1 gap-4 md:grid-cols-2">
            <div>
              <label
                htmlFor="outboundMaxHours"
                className="mb-1 block text-sm text-gray-600"
              >
                가는 편 최대
              </label>
              <div className="flex items-center gap-2">
                <input
                  id="outboundMaxHours"
                  type="number"
                  min={1}
                  max={72}
                  value={outboundMaxHours}
                  onChange={(e) => setOutboundMaxHours(Number(e.target.value))}
                  className="w-24 rounded-lg border border-gray-300 px-3 py-2 text-sm focus:border-blue-500 focus:ring-2 focus:ring-blue-200 focus:outline-none"
                />
                <span className="text-sm text-gray-500">시간</span>
              </div>
            </div>
            <div>
              <label
                htmlFor="returnMaxHours"
                className="mb-1 block text-sm text-gray-600"
              >
                오는 편 최대
              </label>
              <div className="flex items-center gap-2">
                <input
                  id="returnMaxHours"
                  type="number"
                  min={1}
                  max={72}
                  value={returnMaxHours}
                  onChange={(e) => setReturnMaxHours(Number(e.target.value))}
                  className="w-24 rounded-lg border border-gray-300 px-3 py-2 text-sm focus:border-blue-500 focus:ring-2 focus:ring-blue-200 focus:outline-none"
                />
                <span className="text-sm text-gray-500">시간</span>
              </div>
            </div>
          </div>
        )}
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
