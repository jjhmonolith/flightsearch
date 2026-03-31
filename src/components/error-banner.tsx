import type { SearchError } from "@/models/search-response";

interface ErrorBannerProps {
  readonly errors: readonly SearchError[];
}

export default function ErrorBanner({ errors }: ErrorBannerProps) {
  if (errors.length === 0) return null;

  return (
    <div className="rounded-lg border border-yellow-200 bg-yellow-50 p-4">
      <div className="mb-1 text-sm font-medium text-yellow-800">
        일부 검색 소스에서 오류가 발생했습니다
      </div>
      <ul className="list-inside list-disc text-sm text-yellow-700">
        {errors.map((err, i) => (
          <li key={i}>
            [{err.source}] {err.message}
          </li>
        ))}
      </ul>
    </div>
  );
}
