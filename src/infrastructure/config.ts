import { z } from "zod";

const ConfigSchema = z.object({
  TEQUILA_API_KEY: z.string().optional().default(""),
  AMADEUS_CLIENT_ID: z.string().optional().default(""),
  AMADEUS_CLIENT_SECRET: z.string().optional().default(""),
  SERPAPI_KEY: z.string().optional().default(""),
  DUFFEL_API_TOKEN: z.string().optional().default(""),
  CACHE_TTL_MINUTES: z.coerce.number().int().positive().default(15),
  DATABASE_PATH: z.string().default("./data/flightsearch.db"),
});

export type Config = z.infer<typeof ConfigSchema>;

let cachedConfig: Config | null = null;

export function getConfig(): Config {
  if (cachedConfig !== null) {
    return cachedConfig;
  }

  const result = ConfigSchema.safeParse(process.env);
  if (!result.success) {
    const errors = result.error.issues
      .map((issue) => `  ${issue.path.join(".")}: ${issue.message}`)
      .join("\n");
    throw new Error(`Invalid configuration:\n${errors}`);
  }

  cachedConfig = result.data;
  return cachedConfig;
}

export function resetConfigCache(): void {
  cachedConfig = null;
}
