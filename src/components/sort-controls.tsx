"use client";

import type { SortField, SortDirection } from "@/services/flight-sorter";

interface SortControlsProps {
  readonly sortField: SortField;
  readonly sortDirection: SortDirection;
  readonly onSortChange: (field: SortField, direction: SortDirection) => void;
}

const SORT_OPTIONS: { value: SortField; label: string }[] = [
  { value: "price", label: "가격" },
  { value: "duration", label: "소요시간" },
  { value: "stops", label: "경유 횟수" },
];

export default function SortControls({
  sortField,
  sortDirection,
  onSortChange,
}: SortControlsProps) {
  return (
    <div className="flex items-center gap-3">
      <span className="text-sm font-medium text-gray-600">정렬:</span>
      {SORT_OPTIONS.map((option) => {
        const isActive = sortField === option.value;
        return (
          <button
            key={option.value}
            onClick={() => {
              if (isActive) {
                onSortChange(
                  option.value,
                  sortDirection === "asc" ? "desc" : "asc"
                );
              } else {
                onSortChange(option.value, "asc");
              }
            }}
            className={`rounded-lg px-3 py-1.5 text-sm font-medium transition-colors ${
              isActive
                ? "bg-blue-100 text-blue-800"
                : "bg-gray-100 text-gray-600 hover:bg-gray-200"
            }`}
          >
            {option.label}
            {isActive && (sortDirection === "asc" ? " ↑" : " ↓")}
          </button>
        );
      })}
    </div>
  );
}
