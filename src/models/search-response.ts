import { z } from "zod";
import { FlightSchema } from "./flight";

export const SearchErrorSchema = z.object({
  source: z.string(),
  message: z.string(),
});
export type SearchError = z.infer<typeof SearchErrorSchema>;

export const LegResultSchema = z.object({
  label: z.string(),
  from: z.string(),
  to: z.string(),
  date: z.string(),
  flights: z.array(FlightSchema),
});
export type LegResult = z.infer<typeof LegResultSchema>;

export const SearchResponseSchema = z.object({
  flights: z.array(FlightSchema),
  legResults: z.array(LegResultSchema).optional(),
  errors: z.array(SearchErrorSchema),
  searchedAt: z.string(),
  cached: z.boolean(),
  isMultiLeg: z.boolean().default(false),
});
export type SearchResponse = z.infer<typeof SearchResponseSchema>;
