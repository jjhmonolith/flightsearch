"use client";

import { useState, useRef, useEffect, useCallback } from "react";
import type { Airport } from "@/lib/airports";

interface AirportSearchProps {
  readonly id: string;
  readonly label: string;
  readonly value: string;
  readonly onChange: (code: string) => void;
  readonly placeholder?: string;
}

export default function AirportSearch({
  id,
  label,
  value,
  onChange,
  placeholder = "ICN",
}: AirportSearchProps) {
  const [query, setQuery] = useState(value);
  const [suggestions, setSuggestions] = useState<readonly Airport[]>([]);
  const [isOpen, setIsOpen] = useState(false);
  const [highlightIndex, setHighlightIndex] = useState(-1);
  const containerRef = useRef<HTMLDivElement>(null);
  const debounceRef = useRef<ReturnType<typeof setTimeout>>(undefined);

  const fetchSuggestions = useCallback(async (q: string) => {
    if (q.length === 0) {
      setSuggestions([]);
      return;
    }
    try {
      const response = await fetch(
        `/api/airports?q=${encodeURIComponent(q)}`
      );
      const data = await response.json();
      setSuggestions(data.airports ?? []);
      setIsOpen(true);
      setHighlightIndex(-1);
    } catch {
      setSuggestions([]);
    }
  }, []);

  function handleInputChange(input: string) {
    setQuery(input);
    if (debounceRef.current) clearTimeout(debounceRef.current);
    debounceRef.current = setTimeout(() => fetchSuggestions(input), 150);
  }

  function selectAirport(airport: Airport) {
    setQuery(airport.code);
    onChange(airport.code);
    setIsOpen(false);
    setSuggestions([]);
  }

  function handleKeyDown(e: React.KeyboardEvent) {
    if (!isOpen || suggestions.length === 0) return;

    if (e.key === "ArrowDown") {
      e.preventDefault();
      setHighlightIndex((prev) =>
        prev < suggestions.length - 1 ? prev + 1 : 0
      );
    } else if (e.key === "ArrowUp") {
      e.preventDefault();
      setHighlightIndex((prev) =>
        prev > 0 ? prev - 1 : suggestions.length - 1
      );
    } else if (e.key === "Enter" && highlightIndex >= 0) {
      e.preventDefault();
      selectAirport(suggestions[highlightIndex]);
    } else if (e.key === "Escape") {
      setIsOpen(false);
    }
  }

  function handleBlur() {
    // Delay to allow click on suggestion
    setTimeout(() => {
      setIsOpen(false);
      // If query is a valid 3-letter code, set it
      if (query.length === 3) {
        onChange(query.toUpperCase());
      }
    }, 200);
  }

  useEffect(() => {
    setQuery(value);
  }, [value]);

  return (
    <div ref={containerRef} className="relative">
      <label
        htmlFor={id}
        className="mb-1 block text-sm font-medium text-gray-700"
      >
        {label}
      </label>
      <input
        id={id}
        type="text"
        value={query}
        onChange={(e) => handleInputChange(e.target.value)}
        onFocus={() => {
          if (query.length > 0) fetchSuggestions(query);
        }}
        onBlur={handleBlur}
        onKeyDown={handleKeyDown}
        className="w-full rounded-lg border border-gray-300 px-4 py-2 focus:border-blue-500 focus:ring-2 focus:ring-blue-200 focus:outline-none"
        placeholder={placeholder}
        autoComplete="off"
      />

      {isOpen && suggestions.length > 0 && (
        <ul className="absolute z-50 mt-1 max-h-60 w-full overflow-auto rounded-lg border border-gray-200 bg-white shadow-lg">
          {suggestions.map((airport, index) => (
            <li
              key={airport.code}
              onMouseDown={() => selectAirport(airport)}
              className={`cursor-pointer px-4 py-2 text-sm ${
                index === highlightIndex
                  ? "bg-blue-50 text-blue-800"
                  : "hover:bg-gray-50"
              }`}
            >
              <span className="font-bold text-blue-600">{airport.code}</span>
              <span className="ml-2 text-gray-700">{airport.city}</span>
              <span className="ml-1 text-gray-400">- {airport.name}</span>
              <span className="ml-1 text-xs text-gray-400">
                ({airport.country})
              </span>
            </li>
          ))}
        </ul>
      )}
    </div>
  );
}
