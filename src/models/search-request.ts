import { z } from "zod";
import { CabinClassSchema } from "./flight";

const datetimeLocalRegex = /^\d{4}-\d{2}-\d{2}T\d{2}:\d{2}$/;

export const DateTimeRangeSchema = z.object({
  from: z.string().regex(datetimeLocalRegex, "Must be YYYY-MM-DDTHH:mm format"),
  to: z.string().regex(datetimeLocalRegex, "Must be YYYY-MM-DDTHH:mm format"),
});
export type DateTimeRange = z.infer<typeof DateTimeRangeSchema>;

export const StopoverSchema = z.object({
  city: z.string().length(3, "Airport code must be 3 characters"),
  stayHoursMin: z.number().min(1).max(720),
  stayHoursMax: z.number().min(1).max(720),
}).refine((data) => data.stayHoursMax >= data.stayHoursMin, {
  message: "Max hours must be >= min hours",
  path: ["stayHoursMax"],
});
export type Stopover = z.infer<typeof StopoverSchema>;

export const SearchRequestSchema = z
  .object({
    departureCity: z.string().length(3, "Airport code must be 3 characters"),
    returnCity: z.string().length(3, "Airport code must be 3 characters").optional(),
    destinationCities: z
      .array(z.string().length(3, "Airport code must be 3 characters"))
      .min(1, "At least one destination is required")
      .max(10, "Maximum 10 destinations"),
    departureRange: DateTimeRangeSchema,
    returnRange: DateTimeRangeSchema,
    passengers: z.number().int().min(1).max(9).default(1),
    cabinClass: CabinClassSchema.default("economy"),
    currency: z.string().length(3).default("KRW"),
    outboundMaxDurationHours: z.number().min(1).max(72).optional(),
    returnMaxDurationHours: z.number().min(1).max(72).optional(),
    outboundStopovers: z.array(StopoverSchema).max(3).default([]),
    returnStopovers: z.array(StopoverSchema).max(3).default([]),
  })
  .refine(
    (data) => {
      return new Date(data.returnRange.from) > new Date(data.departureRange.from);
    },
    {
      message: "Return must be after departure",
      path: ["returnRange"],
    }
  );

export type SearchRequest = z.infer<typeof SearchRequestSchema>;

/**
 * Extract unique YYYY-MM-DD dates covered by a datetime range.
 * Max 5 dates to limit API calls.
 */
export function getDatesInRange(range: DateTimeRange): readonly string[] {
  const startDate = range.from.split("T")[0];
  const endDate = range.to.split("T")[0];
  const dates: string[] = [];
  const current = new Date(startDate + "T00:00:00Z");
  const end = new Date(endDate + "T00:00:00Z");

  while (current <= end && dates.length < 5) {
    dates.push(current.toISOString().split("T")[0]);
    current.setUTCDate(current.getUTCDate() + 1);
  }

  return dates;
}
