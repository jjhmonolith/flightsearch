/**
 * Format minutes into hours and minutes display string.
 */
export function formatDuration(totalMinutes: number): string {
  const hours = Math.floor(totalMinutes / 60);
  const minutes = totalMinutes % 60;
  if (hours === 0) return `${minutes}분`;
  if (minutes === 0) return `${hours}시간`;
  return `${hours}시간 ${minutes}분`;
}

/**
 * Format price with locale-appropriate separators.
 */
export function formatPrice(amount: number, currency: string): string {
  return new Intl.NumberFormat("ko-KR", {
    style: "currency",
    currency,
    maximumFractionDigits: 0,
  }).format(amount);
}

/**
 * Extract HH:mm from a local datetime string.
 * Supports formats: "2026-05-01T09:00:00", "2026-05-01 09:00", ISO with Z.
 */
export function formatTime(dateTimeStr: string): string {
  // If it's a local time string without Z, extract time directly
  const match = dateTimeStr.match(/(\d{2}):(\d{2})/);
  if (match) {
    return `${match[1]}:${match[2]}`;
  }
  return dateTimeStr;
}

/**
 * Extract HH:mm for time range filtering.
 */
export function extractTimeHHMM(dateTimeStr: string): string {
  return formatTime(dateTimeStr);
}

/**
 * Format date string to display date (M월 D일).
 */
export function formatDate(dateTimeStr: string): string {
  const match = dateTimeStr.match(/(\d{4})-(\d{2})-(\d{2})/);
  if (!match) return dateTimeStr;
  const month = parseInt(match[2], 10);
  const day = parseInt(match[3], 10);
  return `${month}월 ${day}일`;
}
