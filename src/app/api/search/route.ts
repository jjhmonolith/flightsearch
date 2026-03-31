import { NextRequest, NextResponse } from "next/server";
import { SearchRequestSchema } from "@/models/search-request";
import { createAdapterRegistry } from "@/adapters/registry";
import { searchFlights } from "@/services/search-orchestrator";

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const parseResult = SearchRequestSchema.safeParse(body);

    if (!parseResult.success) {
      return NextResponse.json(
        {
          error: "Invalid search request",
          details: parseResult.error.issues.map((issue) => ({
            field: issue.path.join("."),
            message: issue.message,
          })),
        },
        { status: 400 }
      );
    }

    const adapters = createAdapterRegistry();
    const response = await searchFlights(parseResult.data, adapters);

    return NextResponse.json(response);
  } catch (error) {
    console.error("Search API error:", error);
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 }
    );
  }
}
