import { z } from "zod";
import { CabinClassSchema } from "./flight";

const dateStringRegex = /^\d{4}-\d{2}-\d{2}$/;
const timeStringRegex = /^\d{2}:\d{2}$/;

export const TimeRangeSchema = z.object({
  from: z.string().regex(timeStringRegex, "Time must be HH:mm format"),
  to: z.string().regex(timeStringRegex, "Time must be HH:mm format"),
});
export type TimeRange = z.infer<typeof TimeRangeSchema>;

export const StopoverSchema = z.object({
  city: z.string().length(3, "Airport code must be 3 characters"),
  stayDays: z.number().int().min(1).max(30),
});
export type Stopover = z.infer<typeof StopoverSchema>;

export const SearchRequestSchema = z
  .object({
    departureCity: z.string().length(3, "Airport code must be 3 characters"),
    destinationCities: z
      .array(z.string().length(3, "Airport code must be 3 characters"))
      .min(1, "At least one destination is required")
      .max(10, "Maximum 10 destinations"),
    departureDate: z
      .string()
      .regex(dateStringRegex, "Date must be YYYY-MM-DD format"),
    returnDate: z
      .string()
      .regex(dateStringRegex, "Date must be YYYY-MM-DD format"),
    passengers: z.number().int().min(1).max(9).default(1),
    cabinClass: CabinClassSchema.default("economy"),
    currency: z.string().length(3).default("KRW"),
    departureTimeRange: TimeRangeSchema.optional(),
    returnTimeRange: TimeRangeSchema.optional(),
    outboundStopovers: z.array(StopoverSchema).max(3).default([]),
    returnStopovers: z.array(StopoverSchema).max(3).default([]),
  })
  .refine(
    (data) => {
      const departure = new Date(data.departureDate);
      const returnD = new Date(data.returnDate);
      return returnD > departure;
    },
    {
      message: "Return date must be after departure date",
      path: ["returnDate"],
    }
  );

export type SearchRequest = z.infer<typeof SearchRequestSchema>;
