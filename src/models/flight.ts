import { z } from "zod";

export const CabinClassSchema = z.enum([
  "economy",
  "premium_economy",
  "business",
  "first",
]);
export type CabinClass = z.infer<typeof CabinClassSchema>;

export const BookingTypeSchema = z.enum(["redirect"]);
export type BookingType = z.infer<typeof BookingTypeSchema>;

export const PriceSchema = z.object({
  amount: z.number().positive(),
  currency: z.string().length(3),
  source: z.string().min(1),
  bookingUrl: z.string().url(),
  bookingType: BookingTypeSchema,
});
export type Price = z.infer<typeof PriceSchema>;

export const SegmentSchema = z.object({
  departureAirport: z.string().length(3),
  arrivalAirport: z.string().length(3),
  departureTime: z.string().min(1),
  arrivalTime: z.string().min(1),
  airline: z.string().min(1),
  flightNumber: z.string().min(1),
  duration: z.number().positive(),
});
export type Segment = z.infer<typeof SegmentSchema>;

export const FlightLegSchema = z.object({
  segments: z.array(SegmentSchema).min(1),
  totalDuration: z.number().positive(),
  stops: z.number().int().min(0),
});
export type FlightLeg = z.infer<typeof FlightLegSchema>;

export const FlightSchema = z.object({
  id: z.string().min(1),
  outbound: FlightLegSchema,
  returnLeg: FlightLegSchema.optional(),
  prices: z.array(PriceSchema).min(1),
  legLabel: z.string().optional(),
});
export type Flight = z.infer<typeof FlightSchema>;
