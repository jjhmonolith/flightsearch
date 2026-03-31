"use client";

import AirportSearch from "./airport-search";

export interface StopoverData {
  readonly city: string;
  readonly stayDays: number;
}

interface StopoverInputProps {
  readonly label: string;
  readonly stopovers: readonly StopoverData[];
  readonly onChange: (stopovers: StopoverData[]) => void;
}

export default function StopoverInput({
  label,
  stopovers,
  onChange,
}: StopoverInputProps) {
  function handleAdd() {
    onChange([...stopovers, { city: "", stayDays: 2 }]);
  }

  function handleRemove(index: number) {
    onChange(stopovers.filter((_, i) => i !== index));
  }

  function handleCityChange(index: number, city: string) {
    onChange(
      stopovers.map((s, i) => (i === index ? { ...s, city } : s))
    );
  }

  function handleDaysChange(index: number, stayDays: number) {
    onChange(
      stopovers.map((s, i) => (i === index ? { ...s, stayDays } : s))
    );
  }

  return (
    <div>
      <div className="mb-2 flex items-center justify-between">
        <span className="text-sm font-medium text-gray-700">{label}</span>
        {stopovers.length < 3 && (
          <button
            type="button"
            onClick={handleAdd}
            className="rounded-md bg-green-50 px-3 py-1 text-xs font-medium text-green-700 hover:bg-green-100"
          >
            + 경유지 추가
          </button>
        )}
      </div>

      {stopovers.length > 0 && (
        <div className="space-y-2">
          {stopovers.map((stopover, index) => (
            <div key={index} className="flex items-end gap-2 rounded-lg bg-gray-50 p-3">
              <div className="flex-1">
                <AirportSearch
                  id={`stopover-${label}-${index}`}
                  label="경유 도시"
                  value={stopover.city}
                  onChange={(code) => handleCityChange(index, code)}
                  placeholder="도시 검색"
                />
              </div>
              <div className="w-24">
                <label className="mb-1 block text-sm font-medium text-gray-700">
                  체류일
                </label>
                <select
                  value={stopover.stayDays}
                  onChange={(e) =>
                    handleDaysChange(index, Number(e.target.value))
                  }
                  className="w-full rounded-lg border border-gray-300 px-3 py-2 text-sm focus:border-blue-500 focus:ring-2 focus:ring-blue-200 focus:outline-none"
                >
                  {Array.from({ length: 14 }, (_, i) => i + 1).map((n) => (
                    <option key={n} value={n}>
                      {n}일
                    </option>
                  ))}
                </select>
              </div>
              <button
                type="button"
                onClick={() => handleRemove(index)}
                className="rounded-md bg-red-50 px-3 py-2 text-sm text-red-600 hover:bg-red-100"
                aria-label="경유지 삭제"
              >
                삭제
              </button>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
