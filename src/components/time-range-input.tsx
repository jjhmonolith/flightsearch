"use client";

interface TimeRangeInputProps {
  readonly label: string;
  readonly from: string;
  readonly to: string;
  readonly enabled: boolean;
  readonly onEnabledChange: (enabled: boolean) => void;
  readonly onFromChange: (time: string) => void;
  readonly onToChange: (time: string) => void;
}

export default function TimeRangeInput({
  label,
  from,
  to,
  enabled,
  onEnabledChange,
  onFromChange,
  onToChange,
}: TimeRangeInputProps) {
  return (
    <div>
      <div className="mb-1 flex items-center gap-2">
        <input
          type="checkbox"
          id={`enable-${label}`}
          checked={enabled}
          onChange={(e) => onEnabledChange(e.target.checked)}
          className="h-4 w-4 rounded border-gray-300 text-blue-600"
        />
        <label
          htmlFor={`enable-${label}`}
          className="text-sm font-medium text-gray-700"
        >
          {label}
        </label>
      </div>
      {enabled && (
        <div className="flex items-center gap-2">
          <input
            type="time"
            value={from}
            onChange={(e) => onFromChange(e.target.value)}
            className="flex-1 rounded-lg border border-gray-300 px-3 py-2 text-sm focus:border-blue-500 focus:ring-2 focus:ring-blue-200 focus:outline-none"
          />
          <span className="text-sm text-gray-500">~</span>
          <input
            type="time"
            value={to}
            onChange={(e) => onToChange(e.target.value)}
            className="flex-1 rounded-lg border border-gray-300 px-3 py-2 text-sm focus:border-blue-500 focus:ring-2 focus:ring-blue-200 focus:outline-none"
          />
        </div>
      )}
    </div>
  );
}
